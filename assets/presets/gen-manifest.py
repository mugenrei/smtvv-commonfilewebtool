import os
import json

def generate_manifest(directory):
    manifest_path = os.path.join(directory, "preset-manifest.json")

    presets = [
        filename for filename in os.listdir(directory)
        if filename.endswith(".json") and filename != "preset-manifest.json"
    ]

    with open(manifest_path, "w") as manifest_file:
        json.dump(presets, manifest_file, indent=4)
    print(f"Manifest created with {len(presets)} entries.")

generate_manifest(".")
