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
    set "OutputDir=ZZZ_CharacterName_P\Project\Content\Blueprints\Gamedata\BinTable\Common"
) else (
    set "OutputDir=ZZZ_CharacterName_P\Project\Content\L10N\%LANGUAGE%\Blueprints\Gamedata\BinTable\Common"
)

REM Set other variables
set "AssetDir=.\bin"

REM Run UAssetHandler with the provided JSON file
"%AssetDir%\UAssetHandler.exe" "CharacterName.json"

REM Create output directory if it doesn't exist
mkdir "%OutputDir%"

REM Move the .uasset and .uexp files to the output directory
move "CharacterName.uasset" "%OutputDir%\CharacterName.uasset"
move "CharacterName.uexp" "%OutputDir%\CharacterName.uexp"

REM Create the filelist.txt for UnrealPak
@echo "%~dp0ZZZ_CharacterName_P\*.*" "..\..\..\*.*" > "%AssetDir%\filelist.txt"

REM Run UnrealPak with the file list
"%AssetDir%\UnrealPak.exe" "%~dp0ZZZ_CharacterName_P.pak" -create=filelist.txt -compress

echo Done! Now put the mod to the ~mods folder to install it.
pause
endlocal