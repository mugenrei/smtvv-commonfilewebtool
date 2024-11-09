@echo off
setlocal

REM Set variables
set "OutputDir=ZZZ_CharacterName_P\Project\Content\L10N\en\Blueprints\Gamedata\BinTable\Common"
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
