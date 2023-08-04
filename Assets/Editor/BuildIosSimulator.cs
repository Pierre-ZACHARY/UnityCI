using UnityEditor;
using UnityEngine;
using UnityEditor.Build.Reporting;

namespace Editor
{
    public class BuildIosSimulator
    {
        [MenuItem("Build/Build iOS Simulator")]
        static void BuildiOS()
        {
            Debug.Log("Building iOS Simulator");
            //Debug.Log(scenePaths);
            // Set the output folder for the iOS build
            string outputFolder = "Builds/iOS";
            BuildTarget buildTarget = BuildTarget.iOS;

            // set sdk to iphone simulator
            PlayerSettings.iOS.sdkVersion = iOSSdkVersion.SimulatorSDK;
            // Perform iOS build
            BuildReport report = BuildPipeline.BuildPlayer(EditorBuildSettings.scenes, outputFolder, buildTarget, BuildOptions.None);
            BuildSummary summary = report.summary;
            if (summary.result == BuildResult.Succeeded)
            {
                Debug.Log("Build succeeded: " + summary.totalSize + " bytes");
            }

            if (summary.result == BuildResult.Failed)
            {
                Debug.Log("Build failed");
            }
        }
    }

}
