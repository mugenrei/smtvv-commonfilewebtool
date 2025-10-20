@echo off
setlocal

REM --- Language Selection ---
echo Please choose a language by typing its code and pressing Enter.
echo.
echo Available languages:
echo   en, de, es, fr, it, ko, pl, pt, ru, tr, zh-Hans, zh-Hant, jp
echo.
set /p LANGUAGE="Enter language code: "
echo.

REM Set OutputDir based on language choice
if /i "%LANGUAGE%"=="jp" (
    set "OutputDir=com.mugenrei.commonfilespatch\UnrealEssentials\Project\Content\Blueprints\Gamedata\BinTable\Common"
) else (
    set "OutputDir=com.mugenrei.commonfilespatch\UnrealEssentials\Project\Content\L10N\%LANGUAGE%\Blueprints\Gamedata\BinTable\Common"
)

REM Set variables
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
