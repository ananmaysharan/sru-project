#!/usr/bin/env python3
import json
import re
import sys
import zipfile
import xml.etree.ElementTree as ET
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_SOURCE = Path.home() / "Downloads" / "GOLD_commune_master (1).xlsx"
TARGET = ROOT / "src" / "lib" / "data" / "map" / "health-communes-bivariate.json"

NS = "http://schemas.openxmlformats.org/spreadsheetml/2006/main"
REL_NS = "http://schemas.openxmlformats.org/package/2006/relationships"
OFFICE_REL_NS = "http://schemas.openxmlformats.org/officeDocument/2006/relationships"

X_LABELS = {"A": 0, "B": 1, "C": 2}
Y_LABELS = {"1": 0, "2": 1, "3": 2}

METRICS = [
    ("2012", "income", "inc2012_class", "inc2012_x_income"),
    ("2018", "income", "inc2018_class", "inc2018_x_income"),
    ("2012", "poverty", "pov2012_class", "pov2012_x_poverty"),
    ("2018", "poverty", "pov2018_class", "pov2018_x_poverty"),
    ("2014", "left", "left2014_class", "left2014_x_leftvote"),
    ("2020", "left", "left2020_class", "left2020_x_leftvote"),
    ("2018", "elders", "eld2018_class", "eld2018_x_elder"),
    ("2017", "heat", "heat_class", "heat_x_hotpct"),
    ("2021", "dpe", "dpe_class", "dpe_x_efficient"),
    ("2021", "green", "green_class", "green_x_grnpct"),
    ("2021", "health", "hlt3_class", "hlt3_x_per10k"),
]


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

        worksheet = ET.fromstring(zip_file.read(f"xl/{target.lstrip('/')}"))
        rows = []
        for row in worksheet.find(q("sheetData")).findall(q("row")):
            values = []
            for cell in row.findall(q("c")):
                index = col_num(cell.attrib.get("r", "")) - 1
                value = ""
                raw_value = cell.find(q("v"))
                if raw_value is not None and raw_value.text is not None:
                    if cell.attrib.get("t") == "s":
                        value = shared_strings[int(raw_value.text)]
                    else:
                        value = raw_value.text
                while len(values) <= index:
                    values.append("")
                values[index] = value
            rows.append(values)
        return rows


def parse_number(value):
    value = str(value).strip()
    if not value:
        return None
    return float(value)


def normalize_code(value):
    value = str(value).strip()
    if re.fullmatch(r"\d+(?:\.0+)?", value):
        return str(int(float(value))).zfill(5)
    return value


def to_cell_record(cell, metric_value, social_change):
    cell = str(cell).strip()
    if not re.fullmatch(r"[ABC][123]", cell):
        return {
            "cell": None,
            "x_bin": None,
            "y_bin": None,
            "x_label": None,
            "y_label": None,
            "x_value": None,
            "y_value": None,
        }

    x_label = cell[0]
    y_label = cell[1]
    return {
        "cell": cell,
        "x_bin": X_LABELS[x_label],
        "y_bin": Y_LABELS[y_label],
        "x_label": x_label,
        "y_label": y_label,
        "x_value": parse_number(metric_value),
        "y_value": parse_number(social_change),
    }


def main():
    source = Path(sys.argv[1]) if len(sys.argv) > 1 else DEFAULT_SOURCE
    rows = read_sheet_rows(source, "GOLD")
    header = rows[1]
    records = [
        {name: row[index] if index < len(row) else "" for index, name in enumerate(header) if name}
        for row in rows[2:]
        if any(str(value).strip() for value in row)
    ]

    output = {}
    for row in records:
        code = normalize_code(row["insee_code"])
        if not code:
            continue

        commune = {"years": {}}
        social_change = row.get("hsg_growth_pp", "")

        for year, metric, class_col, value_col in METRICS:
            commune["years"].setdefault(year, {})
            commune["years"][year][metric] = to_cell_record(
                row.get(class_col, ""),
                row.get(value_col, ""),
                social_change,
            )

        output[code] = commune

    TARGET.write_text(json.dumps(output, indent=2, ensure_ascii=False) + "\n")
    print(f"Wrote {len(output)} communes to {TARGET}")


if __name__ == "__main__":
    main()
