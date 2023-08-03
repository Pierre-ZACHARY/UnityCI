using UnityEditor;
using UnityEngine;

namespace Editor
{
    public class BuildIosSimulator
    {
        static void BuildiOS()
        {
            // Get all scenes added to the build settings
            //EditorBuildSettingsScene[] scenes = EditorBuildSettings.scenes;

            // Create an array to store scene paths
            //string[] scenePaths = new string[scenes.Length];

            // Extract the scene paths from EditorBuildSettingsScene array
            //for (int i = 0; i < scenes.Length; i++)
            //{
            //    scenePaths[i] = scenes[i].path;
            //}

            //Debug.Log("Building iOS Simulator");
            //Debug.Log(scenePaths);
            // Set the output folder for the iOS build
            //string outputFolder = "Builds/iOS";
            //BuildTarget buildTarget = BuildTarget.iOS;

            // set sdk to iphone simulator
            //PlayerSettings.iOS.sdkVersion = iOSSdkVersion.SimulatorSDK;
            // Perform iOS build
            //BuildPipeline.BuildPlayer(scenes, outputFolder, buildTarget, BuildOptions.None);
        }
    }
}
