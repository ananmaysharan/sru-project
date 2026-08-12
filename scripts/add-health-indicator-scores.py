#!/usr/bin/env python3
import json
import re
import sys
import zipfile
import xml.etree.ElementTree as ET
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_SOURCE = Path.home() / "Downloads" / "WEIGHTED_commune_index.xlsx"
TARGET = ROOT / "src" / "lib" / "data" / "charts" / "commune-health-index-scatter.json"

NS = "http://schemas.openxmlformats.org/spreadsheetml/2006/main"
REL_NS = "http://schemas.openxmlformats.org/package/2006/relationships"
OFFICE_REL_NS = "http://schemas.openxmlformats.org/officeDocument/2006/relationships"

INDICATOR_COLUMNS = {
    "income": "score_income",
    "poverty": "score_poverty",
    "ageing": "score_ageing",
    "heat": "score_heat",
    "energy": "score_energy",
    "green": "score_green",
    "health": "score_health",
}


def q(tag):
    return f"{{{NS}}}{tag}"


def col_num(cell_ref):
    match = re.match(r"([A-Z]+)", cell_ref or "")
    value = 0
    for char in match.group(1) if match else "":
        value = value * 26 + ord(char) - 64
    return value


def read_shared_strings(zip_file):
    if "xl/sharedStrings.xml" not in zip_file.namelist():
        return []

    root = ET.fromstring(zip_file.read("xl/sharedStrings.xml"))
    return [
        "".join(text.text or "" for text in item.iter(q("t")))
        for item in root.findall(q("si"))
    ]


def read_sheet_rows(path, sheet_name):
    with zipfile.ZipFile(path) as zip_file:
        shared_strings = read_shared_strings(zip_file)
        workbook = ET.fromstring(zip_file.read("xl/workbook.xml"))
        rels = ET.fromstring(zip_file.read("xl/_rels/workbook.xml.rels"))
        rel_map = {
            rel.attrib["Id"]: rel.attrib["Target"]
            for rel in rels.findall(f"{{{REL_NS}}}Relationship")
        }

        target = None
        for sheet in workbook.find(q("sheets")).findall(q("sheet")):
            if sheet.attrib["name"] == sheet_name:
                rel_id = sheet.attrib[f"{{{OFFICE_REL_NS}}}id"]
                target = rel_map[rel_id]
                break

        if target is None:
            raise ValueError(f"Could not find sheet {sheet_name!r} in {path}")

        worksheet = ET.fromstring(zip_file.read(f"xl/{target.lstrip('/')}") )
        rows = []
        for row in worksheet.find(q("sheetData")).findall(q("row")):
            values = []
            for cell in row.findall(q("c")):
                index = col_num(cell.attrib.get("r", "")) - 1
                value = ""
                raw_value = cell.find(q("v"))
                if raw_value is not None and raw_value.text is not None:
                    value = (
                        shared_strings[int(raw_value.text)]
                        if cell.attrib.get("t") == "s"
                        else raw_value.text
                    )
                while len(values) <= index:
                    values.append("")
                values[index] = value
            rows.append(values)
        return rows


def normalize_code(value):
    value = str(value).strip()
    if re.fullmatch(r"\d+(?:\.0+)?", value):
        return str(int(float(value))).zfill(5)
    return value


def parse_score(value):
    value = str(value).strip()
    return None if not value else round(float(value), 4)


def main():
    source = Path(sys.argv[1]) if len(sys.argv) > 1 else DEFAULT_SOURCE
    rows = read_sheet_rows(source, "weighted_average")
    header = rows[1]
    source_records = {
        normalize_code(row[0]): {
            name: row[index] if index < len(row) else ""
            for index, name in enumerate(header)
            if name
        }
        for row in rows[2:]
        if row and normalize_code(row[0])
    }

    target_records = json.loads(TARGET.read_text())
    matched = 0
    for record in target_records:
        source_record = source_records.get(record["code"])
        if source_record is None:
            record["indicatorScores"] = {key: None for key in INDICATOR_COLUMNS}
            continue

        matched += 1
        record["indicatorScores"] = {
            key: parse_score(source_record.get(column, ""))
            for key, column in INDICATOR_COLUMNS.items()
        }

    TARGET.write_text(json.dumps(target_records, indent=2, ensure_ascii=False) + "\n")
    print(
        f"Added seven indicator scores to {matched} of {len(target_records)} communes in {TARGET}"
    )


if __name__ == "__main__":
    main()
