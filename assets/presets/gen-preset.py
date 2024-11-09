import json

def load_character_data(filepath):
    """Load and parse character data, extracting relevant entries."""
    with open(filepath, "r") as file:
        data = json.load(file)
    
    extracted_data = {}

    def extract_text_properties(obj, path=""):
        """Recursive function to extract paths and CultureInvariantString values."""
        if isinstance(obj, dict):
            if obj.get("$type") == "UAssetAPI.PropertyTypes.Objects.TextPropertyData, UAssetAPI":
                # Extract path and value of CultureInvariantString
                culture_string = obj.get("CultureInvariantString", "")
                extracted_data[path] = culture_string
            for key, value in obj.items():
                extract_text_properties(value, f"{path}.{key}" if path else key)
        elif isinstance(obj, list):
            for index, item in enumerate(obj):
                extract_text_properties(item, f"{path}.{index}")

    extract_text_properties(data)
    return extracted_data


def create_diff_preset(original_file, edited_file, output_preset):
    """Create a preset containing only entries that differ between original and edited files."""
    original_data = load_character_data(original_file)
    edited_data = load_character_data(edited_file)

    # Find differences by checking entries with different CultureInvariantString values
    diff_data = {
        path: edited_data[path]
        for path in edited_data
        if path in original_data and original_data[path] != edited_data[path]
    }

    # Save the diff data as a preset
    with open(output_preset, "w") as preset_file:
        json.dump(diff_data, preset_file, indent=4)
    
    print(f"Preset created with {len(diff_data)} modified entries in {output_preset}")


# Define file paths
original_file = "CharacterNameA.json"
edited_file = "CharacterNameB.json"
output_preset_file = "Preset.json"

# Example usage
create_diff_preset(original_file, edited_file, output_preset_file)
