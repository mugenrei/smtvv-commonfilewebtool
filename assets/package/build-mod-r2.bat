@echo off
setlocal

REM Set variables
set "OutputDir=com.mugenrei.commonfilespatch\UnrealEssentials\Project\Content\L10N\en\Blueprints\Gamedata\BinTable\Common"
set "AssetDir=.\bin"

REM Run UAssetHandler with the provided JSON file
"%AssetDir%\UAssetHandler.exe" "CharacterName.json"

REM Create output directory if it doesn't exist
mkdir "%OutputDir%"

REM Move the .uasset, .uexp and .json files to the output directory
move "CharacterName.uasset" "%OutputDir%\CharacterName.uasset"
move "CharacterName.uexp" "%OutputDir%\CharacterName.uexp"
move "ModConfig.json" "com.mugenrei.commonfilespatch\ModConfig.json"
move "Sewer56.Update.Metadata.json" "com.mugenrei.commonfilespatch\Sewer56.Update.Metadata.json"

powershell -Command "Compress-Archive -Path '.\com.mugenrei.commonfilespatch\*' -DestinationPath 'com.mugenrei.commonfilespatch.zip'"

echo Done! Now drag and drop com.mugenrei.commonfilespatch.zip to your Reloaded 2 to install the mod.
pause
endlocal
