const editor = document.getElementById("editor");
const fileInput = document.getElementById("fileInput");
const saveButton = document.getElementById("saveButton");
const presetList = document.getElementById("preset-list");
const savePackageButton = document.getElementById("savePackageButton");
const savePresetButton = document.getElementById("savePresetButton");
const loadPresetButton = document.getElementById("loadPresetButton");
savePackageButton.disabled = true; // Disable button at the start
savePresetButton.disabled = true; // Disable button at the start
saveButton.disabled = true; // Disable button at the start
loadPresetButton.disabled = true; // Disable button at the start

let jsonData = null;
let editData = {}; // Stores only edited fields
let originalData = {}; // Stores initial values for comparison

// Load custom file
fileInput.addEventListener("change", loadFile);

// Load built-in presets on page load
window.onload = loadBuiltInPresets;

// Function to load and parse JSON
function loadFile(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            jsonData = JSON.parse(e.target.result);
            parseData(jsonData);
            saveButton.disabled = false;
            loadPresetButton.disabled = false;
            savePresetButton.disabled = false;
            savePackageButton.disabled = false;
        } catch (err) {
            alert("Error parsing JSON file.");
            console.error(err);
        }
    };
    reader.readAsText(file);
}

// Function to parse JSON, find relevant dictionaries, and store initial values
function parseData(obj, path = "") {
    for (const key in obj) {
        const currentPath = path ? `${path}.${key}` : key;

        if (typeof obj[key] === "object" && obj[key] !== null) {
            if (obj[key]["$type"] === "UAssetAPI.PropertyTypes.Objects.TextPropertyData, UAssetAPI") {
                const cultureString = obj[key]["CultureInvariantString"];
                createEditorField(currentPath, cultureString);
                
                // Store initial value in originalData for comparison
                originalData[currentPath] = cultureString;
                editData[currentPath] = cultureString; // Initialize with original value
            } else {
                parseData(obj[key], currentPath);
            }
        }
    }
}

// Function to create editable fields in the editor
function createEditorField(path, value) {
    const field = document.createElement("div");
    field.className = "editor-entry"; // Add the editor-entry class
    field.innerHTML = `
        <label class="editor-label"><strong>${value.replace(/:.*?$/gi, "")}</strong></label>
        <input class="editor-input" type="text" value="${value}" onchange="updateEditData('${path}', this.value)">
    `;
    editor.appendChild(field);
}

// Update function to modify editData object only when value changes
function updateEditData(path, value) {
    if (value !== originalData[path]) { // Only save if different from original
        editData[path] = value;
    } else {
        delete editData[path]; // Remove entry if reset to original value
    }
}

// Function to save only edited fields as a preset
function savePreset() {
    const presetData = {};

    // Only save entries in editData that differ from originalData
    for (const path in editData) {
        if (editData[path] !== originalData[path]) {
            presetData[path] = editData[path];
        }
    }

    const presetJson = JSON.stringify(presetData, null, 2);
    downloadFile("Preset.json", presetJson);
}

// Load built-in presets from assets/presets
function loadBuiltInPresets() {
    fetch("assets/presets/preset-manifest.json")
        .then(response => response.json())
        .then(files => {
            files.forEach(file => {
                const presetName = file.replace(/(\.json|\/assets\/presets\/)/gi, "").replaceAll("_", " ");
                const presetItem = document.createElement("div");
                presetItem.className = "preset-item";
                presetItem.innerText = presetName;
                console.log(presetName);
                presetItem.onclick = () => loadBuiltInPreset(file);
                presetList.appendChild(presetItem);
            });
        })
        .catch(err => console.error("Failed to load presets:", err));
}

// Load and apply a built-in preset
function loadBuiltInPreset(filename) {
    fetch(`assets/presets/${filename}`)
        .then(response => response.json())
        .then(presetData => applyPreset(presetData))
        .catch(err => console.error("Failed to load preset:", err));
}

// Function to load a preset and apply its values without overwriting other edited entries
function loadPreset(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const presetData = JSON.parse(e.target.result);
            applyPreset(presetData);
        } catch (err) {
            alert("Error parsing preset file.");
            console.error(err);
        }
    };
    reader.readAsText(file);
}

// Function to apply preset values to jsonData and editor fields without overwriting other edits
function applyPreset(presetData) {
    for (const path in presetData) {
        setJsonValue(jsonData, path.split("."), presetData[path]);
        editData[path] = presetData[path];

        // Update the editor UI to reflect the loaded preset value
        const input = document.querySelector(`input[onchange="updateEditData('${path}', this.value)"]`);
        if (input) input.value = presetData[path];
    }
}

// Function to save the edited data back into jsonData
function saveChanges() {
    if (!jsonData) return;

    for (const path in editData) {
        setJsonValue(jsonData, path.split("."), editData[path]);
    }

    const updatedJson = JSON.stringify(jsonData, null, 2);
    downloadFile("CharacterName.json", updatedJson);
}

// Helper function to set a nested value in jsonData based on path
function setJsonValue(obj, keys, value) {
    const lastKey = keys.pop();
    const deepObj = keys.reduce((o, key) => o[key] = o[key] || {}, obj);
    
    if (deepObj[lastKey] && deepObj[lastKey]["$type"] === "UAssetAPI.PropertyTypes.Objects.TextPropertyData, UAssetAPI") {
        deepObj[lastKey]["CultureInvariantString"] = value;
    }
}

// Function to download JSON files
function downloadFile(filename, content) {
    const blob = new Blob([content], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

// Function to save package as a zip file
async function savePackage() {
    const savePackageButton = document.getElementById("savePackageButton");
    savePackageButton.disabled = true; // Disable button at the start
    savePackageButton.style.opacity = 0.5; // Gray out button

    const zip = new JSZip();

    // Adding existing files UnrealPak.exe and build-mod.bat from assets/package
    try {
        const unrealPak = await fetch("assets/package/bin/UnrealPak", { method: "GET", headers: { "Content-Type": "application/octet-stream" } })
            .then(res => res.blob());

        zip.file("assets/package/bin/UnrealPak.exe", unrealPak);

        const uAssetHandler = await fetch("assets/package/bin/UAssetHandler", { method: "GET", headers: { "Content-Type": "application/octet-stream" } })
            .then(res => res.blob());
        zip.file("assets/package/bin/UAssetHandler.exe", uAssetHandler);

        const buildMod = await fetch("assets/package/build-mod.bat").then(res => res.blob());
        zip.file("assets/package/build-mod.bat", buildMod);
    } catch (error) {
        console.error("Failed to add existing files to package:", error);
        alert("Failed to add existing files to the package. Please try again.");
        savePackageButton.disabled = false;
        savePackageButton.style.opacity = 1;
        return;
    }

    // Adding the current CharacterName.json file from jsonData
    const characterDataBlob = new Blob([JSON.stringify(jsonData, null, 2)], { type: "application/json" });
    zip.file("assets/package/CharacterName.json", characterDataBlob);

    // Generate the zip file and trigger the download
    zip.generateAsync({ type: "blob" }).then((content) => {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(content);
        link.download = "CharacterNamePackage.zip";
        link.click();
        URL.revokeObjectURL(link.href);
    }).catch(err => {
        console.error("Failed to generate zip file:", err);
        alert("Failed to generate package. Please try again.");
    }).finally(() => {
        // Re-enable button when function completes
        savePackageButton.disabled = false;
        savePackageButton.style.opacity = 1;
    });
}