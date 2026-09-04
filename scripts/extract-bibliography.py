"""Read the master DOCX bibliography and print rich-text JSON (never edit the DOCX).

Usage: python scripts/extract-bibliography.py SRU_FR_TRANSLATION_MASTERDOC.docx
Only deletion residue in the APUR citations and Freeman author list is cleaned up. Other retained
wording, capitalization, punctuation, and nonbreaking spaces remain unchanged.
"""

import json
import re
import sys
import xml.etree.ElementTree as ET
from zipfile import ZipFile

W = '{http://schemas.openxmlformats.org/wordprocessingml/2006/main}'
R = '{http://schemas.openxmlformats.org/officeDocument/2006/relationships}'
HEADINGS = [
    'Articles scientifiques', 'Chapitres d’ouvrages collectifs',
    'Rapports et études d’urbanisme', 'Articles de presse', 'Podcasts',
    'Expositions', 'Couverture médiatique de mon travail',
]


def extract(path):
    with ZipFile(path) as archive:
        document = ET.fromstring(archive.read('word/document.xml'))
        styles = ET.fromstring(archive.read('word/styles.xml'))
        relationships = {
            el.get('Id'): el.get('Target')
            for el in ET.fromstring(archive.read('word/_rels/document.xml.rels'))
        }
    style_map = {el.get(W + 'styleId'): el for el in styles.findall(W + 'style')}

    def property_value(properties, key):
        if properties is None:
            return None
        value = properties.find(W + key)
        if value is None:
            return None
        return value.get(W + 'val', '1') not in ('0', 'false', 'off')

    def run_property(run, key):
        properties = run.find(W + 'rPr')
        value = property_value(properties, key)
        style = properties.find(W + 'rStyle') if properties is not None else None
        seen = set()
        while value is None and style is not None:
            name = style.get(W + 'val')
            if name in seen or name not in style_map:
                break
            seen.add(name)
            definition = style_map[name]
            value = property_value(definition.find(W + 'rPr'), key)
            style = definition.find(W + 'basedOn')
        return bool(value)

    def segments(element, href=None):
        result = []
        for child in element:
            if child.tag == W + 'del':
                continue
            if child.tag == W + 'r':
                if run_property(child, 'strike') or run_property(child, 'dstrike'):
                    continue
                text = ''.join(el.text or '' for el in child.iter(W + 't'))
                if not text:
                    continue
                span = {'text': text}
                if href:
                    if not href.startswith(('https://', 'http://')):
                        raise ValueError('Unexpected bibliography URL: ' + href)
                    span['href'] = href
                if run_property(child, 'i'):
                    span['italic'] = True
                if run_property(child, 'b'):
                    span['bold'] = True
                result.append(span)
            else:
                target = relationships[child.get(R + 'id')] if child.tag == W + 'hyperlink' else href
                result.extend(segments(child, target))
        return result

    sections = []
    active = False
    for paragraph in document.find(W + 'body').findall(W + 'p'):
        text = ''.join(el.text or '' for el in paragraph.iter(W + 't')).strip()
        if 'SUBPAGE' in text and 'Bibliography' in text:
            active = True
            continue
        if active and 'SUBPAGE' in text:
            break
        if not active or not text:
            continue
        heading = HEADINGS[-1] if text.startswith('Media mentions of our work becomes') else text
        if heading in HEADINGS:
            sections.append({'title': heading, 'items': []})
            continue
        spans = segments(paragraph)
        # Merge Word's arbitrary run splits without losing link/style boundaries.
        merged = []
        for span in spans:
            style = {k: v for k, v in span.items() if k != 'text'}
            previous = {k: v for k, v in merged[-1].items() if k != 'text'} if merged else None
            if previous == style:
                merged[-1]['text'] += span['text']
            else:
                merged.append(span.copy())
        if text.startswith('Contribution au rapport'):
            for span in merged:
                span['text'] = re.sub(r'\s*\(?, Paris,', ', Paris,', span['text'])
        if text.startswith('Lance Freeman'):
            merged[0]['text'] = merged[0]['text'].replace('Freemanet ', 'Freeman et ', 1)
        sections[-1]['items'].append({'segments': merged})
    assert [s['title'] for s in sections] == HEADINGS
    assert [len(s['items']) for s in sections] == [5, 3, 4, 11, 2, 1, 14]
    return sections


if __name__ == '__main__':
    print(json.dumps(extract(sys.argv[1]), ensure_ascii=False))
