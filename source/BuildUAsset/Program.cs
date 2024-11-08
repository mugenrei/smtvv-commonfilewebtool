using UAssetAPI;
using UAssetAPI.UnrealTypes;

namespace UAssetHandler
{
    class Program
    {
        private static readonly Dictionary<string, EngineVersion> engineVersionMap = new Dictionary<string, EngineVersion>
        {
            { "UNKNOWN", EngineVersion.UNKNOWN },
            { "VER_UE4_OLDEST_LOADABLE_PACKAGE", EngineVersion.VER_UE4_OLDEST_LOADABLE_PACKAGE },
            { "VER_UE4_0", EngineVersion.VER_UE4_0 },
            { "VER_UE4_1", EngineVersion.VER_UE4_1 },
            { "VER_UE4_2", EngineVersion.VER_UE4_2 },
            { "VER_UE4_3", EngineVersion.VER_UE4_3 },
            { "VER_UE4_4", EngineVersion.VER_UE4_4 },
            { "VER_UE4_5", EngineVersion.VER_UE4_5 },
            { "VER_UE4_6", EngineVersion.VER_UE4_6 },
            { "VER_UE4_7", EngineVersion.VER_UE4_7 },
            { "VER_UE4_8", EngineVersion.VER_UE4_8 },
            { "VER_UE4_9", EngineVersion.VER_UE4_9 },
            { "VER_UE4_10", EngineVersion.VER_UE4_10 },
            { "VER_UE4_11", EngineVersion.VER_UE4_11 },
            { "VER_UE4_12", EngineVersion.VER_UE4_12 },
            { "VER_UE4_13", EngineVersion.VER_UE4_13 },
            { "VER_UE4_14", EngineVersion.VER_UE4_14 },
            { "VER_UE4_15", EngineVersion.VER_UE4_15 },
            { "VER_UE4_16", EngineVersion.VER_UE4_16 },
            { "VER_UE4_17", EngineVersion.VER_UE4_17 },
            { "VER_UE4_18", EngineVersion.VER_UE4_18 },
            { "VER_UE4_19", EngineVersion.VER_UE4_19 },
            { "VER_UE4_20", EngineVersion.VER_UE4_20 },
            { "VER_UE4_21", EngineVersion.VER_UE4_21 },
            { "VER_UE4_22", EngineVersion.VER_UE4_22 },
            { "VER_UE4_23", EngineVersion.VER_UE4_23 },
            { "VER_UE4_24", EngineVersion.VER_UE4_24 },
            { "VER_UE4_25", EngineVersion.VER_UE4_25 },
            { "VER_UE4_26", EngineVersion.VER_UE4_26 },
            { "VER_UE4_27", EngineVersion.VER_UE4_27 },
            { "VER_UE5_0", EngineVersion.VER_UE5_0 },
            { "VER_UE4_AUTOMATIC_VERSION_PLUS_ONE", EngineVersion.VER_UE4_AUTOMATIC_VERSION_PLUS_ONE },
            { "VER_UE4_AUTOMATIC_VERSION", EngineVersion.VER_UE4_AUTOMATIC_VERSION },
        };
        [STAThread]
        static void Main(string[] args)
        {
            Console.WriteLine("Drag and drop a JSON or UAsset file onto this executable.");

            if (args.Length == 0)
            {
                Console.WriteLine("No file detected. Exiting...");
                return;
            }

            string inputFilePath = args[0];
            if (!File.Exists(inputFilePath))
            {
                Console.WriteLine("The file does not exist. Please provide a valid file.");
                return;
            }

            // Determine the engine version if provided as an optional second argument
            EngineVersion selectedEngineVersion = EngineVersion.UNKNOWN;
            if (args.Length > 1 && engineVersionMap.ContainsKey(args[1].ToUpper()))
            {
                selectedEngineVersion = engineVersionMap[args[1].ToUpper()];
            }
            else if (args.Length > 1)
            {
                Console.WriteLine($"Warning: Engine version '{args[1]}' not recognized, defaulting to UNKNOWN.");
            }

            string fileExtension = Path.GetExtension(inputFilePath).ToLower();
            try
            {
                if (fileExtension == ".json")
                {
                    // JSON to UAsset conversion
                    string jsonContent = File.ReadAllText(inputFilePath);
                    if (string.IsNullOrEmpty(jsonContent))
                    {
                        Console.WriteLine("The JSON file is empty.");
                        return;
                    }

                    // Deserialize the JSON into a UAsset object
                    var asset = UAsset.DeserializeJson(jsonContent);

                    // Write the .uasset and .uexp files
                    asset.Write(Path.ChangeExtension(inputFilePath, "uasset"));
                    Console.WriteLine("UAsset and UExp files saved.");
                }
                else if (fileExtension == ".uasset")
                {
                    // UAsset to JSON conversion
                    UAsset asset = new UAsset(inputFilePath, selectedEngineVersion);
                    string jsonContent = asset.SerializeJson(Newtonsoft.Json.Formatting.Indented);

                    // Write the JSON to a file
                    string outputFilePath = Path.ChangeExtension(inputFilePath, "json");
                    File.WriteAllText(outputFilePath, jsonContent);
                    Console.WriteLine("JSON file saved.");
                }
                else
                {
                    Console.WriteLine("Unsupported file type. Please provide either a .json or .uasset file.");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("An error occurred: " + ex.Message);
            }
        }
    }
}
