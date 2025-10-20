# smtvv-commonfilewebtool

A web-based tool for editing `CharacterName.json` files from Shin Megami Tensei V: Vengeance. This tool allows users to apply presets from existing mods, load custom presets, and manually edit entries to create their own mods.

## How to Use

1.  **Load `CharacterName.json`**:
    *   Click the "Load `CharacterName.json`" button to upload your file. You can find clean files [here](https://github.com/mugenrei/smtvv-commonfilewebtool/tree/main/assets/cleanfiles).

2.  **Apply Presets**:
    *   Select one or more presets from the "Mods Presets" list. If multiple presets modify the same entry, the last loaded preset will take precedence.
    *   Optionally, load your own preset file by clicking "Load Preset File" under "Your Own Preset."

3.  **Manual Edits (Optional)**:
    *   Manually edit the values in the displayed fields. Your changes are automatically saved.

4.  **Save Your Work**:
    *   **Save Preset**: Save your current changes as a `.json` preset file for future use.
    *   **Save Package (PAK or Reloaded II)**: Package your changes into a distributable mod format. This will download a `.zip` file containing the necessary files to build the mod.
    *   **Save `CharacterName.json`**: Save the modified `CharacterName.json` file.

5.  **Build and Install the Mod**:
    *   Extract the downloaded `.zip` file.
    *   Run `build-mod.bat` for the PAK version or `build-mod-r2.bat` for the Reloaded II version.
    *   **For PAK**: Move the generated `.pak` file to the `~mods` folder of your game.
    *   **For Reloaded II**: Drag and drop the generated `.zip` file into the Reloaded II interface and ensure it is last in the load order.
