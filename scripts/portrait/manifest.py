#!/usr/bin/env python3
"""Rebuild app/data/portrait/styles.ts from the images actually on disk.

generate.py writes the manifest when it finishes. This rebuilds it at any point
-- after a partial run, or after regenerating a few styles -- so the site only
ever lists styles whose image exists. Timings are read back from a run log when
one is given, otherwise they are left at 0.

    python3 scripts/portrait/manifest.py [--log /tmp/portrait-run.log]
"""

import argparse
import importlib.util
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from styles import STYLES, prompt_for  # noqa: E402

spec = importlib.util.spec_from_file_location("gen", os.path.join(HERE, "generate.py"))
gen = importlib.util.module_from_spec(spec)
sys.modules["gen"] = gen
spec.loader.exec_module(gen)

DEFAULT_BACKEND = gen.BACKENDS["nim"]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--log", default="")
    ap.add_argument("--backend", default="nim", choices=sorted(gen.BACKENDS))
    args = ap.parse_args()
    backend = gen.BACKENDS[args.backend]

    seconds = {}
    if args.log and os.path.exists(args.log):
        for line in open(args.log, encoding="utf-8"):
            m = re.match(r"\[\s*\d+/\s*\d+\]\s+(\S+)\s+[\d.]+ KB\s+([\d.]+)s", line)
            if m:
                seconds[m.group(1)] = float(m.group(2))

    records = []
    for i, (slug, name, category, medium) in enumerate(STYLES):
        if not os.path.exists(os.path.join(gen.OUT_DIR, slug + ".webp")):
            continue
        records.append({
            "slug": slug, "name": name, "category": category,
            "description": medium, "prompt": prompt_for(medium),
            "engine": backend["engine"], "model": backend["model"],
            "node": backend["node"], "precision": backend["precision"],
            "steps": backend["steps"], "seed": 20261115 + i,
            "seconds": seconds.get(slug, 0.0),
        })

    gen.write_manifest(records)
    cats = len({r["category"] for r in records})
    print(f"{len(records)} of {len(STYLES)} styles have images, {cats} categories")


if __name__ == "__main__":
    main()
