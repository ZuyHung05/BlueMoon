import json

def read_json(path: str):
    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)
    return data

def read_txt(path: str):
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()
    return content
