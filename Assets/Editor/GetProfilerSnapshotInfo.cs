using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using Unity.Collections;
using Unity.Profiling;
using Unity.VisualScripting.YamlDotNet.RepresentationModel;
using UnityEditor;
using UnityEditor.Profiling;
using UnityEditorInternal;
using UnityEngine;
using UnityEngine.Profiling;

namespace Editor
{
    struct SampleInfo
    {
        public string name;
        public ulong totalTimeMs;
        public ulong meanTimeMs;
        public ulong minTimeMs;
        public ulong maxTimeMs;
        public uint frames;
        public uint samplesCount;
    }
    public class GetProfilerSnapshotInfo: UnityEditor.Editor
    {
        private static string _path = GetProfilerLogParentDirectory(GetProfilerLogFilePath());

        [MenuItem("Tools/GetProfilerSnapshot")]
        public static void GetProfilerSnapshot()
        {
            if(_path == null){
                Debug.LogError("Profiler log file path is null");
                return;
            }
            Hashtable sampleInfoMap = new Hashtable();
            // Get all samples names from the profiler log file located at _path/CiProfilerSamples.txt where path is the report folder path
            string[] sampleNames = File.ReadAllLines(Path.Combine(_path, "CiProfilerSamples.txt"));

            string playModePath = Path.Combine(_path, "playmodeProfile.raw");
            string editModePath = Path.Combine(_path, "editmodeProfile.raw");
            List<Tuple<string, string>> paths = new List<Tuple<string, string>>();
            paths.Add(Tuple.Create("Playmode", playModePath));
            paths.Add(Tuple.Create("Editmode", editModePath));
            foreach (var tuple in paths)
            {
                var path = tuple.Item2;
                var mode = tuple.Item1;
                ProfilerDriver.LoadProfile(path, false);
                foreach(string name in sampleNames)
                {
                    for (int frame = ProfilerDriver.firstFrameIndex; frame < ProfilerDriver.lastFrameIndex; frame++)
                    {
                        var threadIndex = 0;
                        var frameData = ProfilerDriver.GetRawFrameDataView(frame, threadIndex);
                        while (frameData.valid)
                        {
                            var markerId = frameData.GetMarkerId(name);
                            bool frameAdded = false;
                            for (int sampleIndex = 0; sampleIndex < frameData.sampleCount; sampleIndex++)
                            {
                                if(frameData.GetSampleMarkerId(sampleIndex) == markerId)
                                {
                                    SampleInfo sampleInfo;
                                    string key = $"{mode}.{name}";
                                    var currentTime = frameData.GetSampleTimeNs(sampleIndex) / 1000000;
                                    if (sampleInfoMap.ContainsKey(key))
                                    {
                                        sampleInfo = (SampleInfo)sampleInfoMap[key];
                                        sampleInfo.totalTimeMs += currentTime;
                                        if (!frameAdded)
                                        {
                                            sampleInfo.frames++;
                                            frameAdded = true;
                                        }
                                        sampleInfo.samplesCount += 1;
                                        sampleInfo.minTimeMs = Math.Min(sampleInfo.minTimeMs, currentTime);
                                        sampleInfo.maxTimeMs = Math.Max(sampleInfo.maxTimeMs, currentTime);
                                    }
                                    else
                                    {
                                        sampleInfo = new SampleInfo();
                                        sampleInfo.name = name;
                                        sampleInfo.totalTimeMs = sampleInfo.minTimeMs = sampleInfo.maxTimeMs = sampleInfo.meanTimeMs  = currentTime;
                                        if (!frameAdded)
                                        {
                                            sampleInfo.frames = 1;
                                            frameAdded = true;
                                        }
                                        sampleInfo.samplesCount = 1;
                                    }
                                    sampleInfoMap[key] = sampleInfo;
                                }
                            }
                            frameData = ProfilerDriver.GetRawFrameDataView(frame, ++threadIndex);
                            frameData.Dispose();
                        }
                        frameData.Dispose();
                    }
                }
            }

            string outputPath = Path.Combine(_path, "profilerReport.csv"); // Set this to your desired file path

            using (StreamWriter writer = new StreamWriter(outputPath))
            {
                // Write the header row
                writer.WriteLine("Name,TotalTimeMs,MeanTimeMs,MinTimeMs,MaxTimeMs,Frames,SamplesCount");

                // Write data rows
                foreach (var sample in sampleInfoMap.Keys)
                {
                    var sampleInfo = (SampleInfo)sampleInfoMap[sample];
                    sampleInfo.meanTimeMs = sampleInfo.totalTimeMs / sampleInfo.samplesCount;
                    writer.WriteLine($"{sampleInfo.name},{sampleInfo.totalTimeMs},{sampleInfo.meanTimeMs},{sampleInfo.minTimeMs},{sampleInfo.maxTimeMs},{sampleInfo.frames},{sampleInfo.samplesCount}");
                }

                Debug.Log($"CSV file written successfully at {outputPath}");
            }
        }




        private static string GetProfilerLogFilePath()
        {
            string[] commandLineArgs = Environment.GetCommandLineArgs();
            for (int i = 0; i < commandLineArgs.Length - 1; i++)
            {
                if (commandLineArgs[i] == "-logFile")
                {
                    return commandLineArgs[i + 1];
                }
            }
            return null; // Return null if the custom profiler log file path was not specified.
        }

        private static string GetProfilerLogParentDirectory(string profilerLogPath)
        {
            if (!string.IsNullOrEmpty(profilerLogPath))
            {
                try
                {
                    string parentDirectory = Path.GetDirectoryName(profilerLogPath);
                    if (!string.IsNullOrEmpty(parentDirectory))
                    {
                        return parentDirectory;
                    }
                }
                catch (Exception e)
                {
                    Debug.LogError("Error getting parent directory: " + e.Message);
                }
            }
            return null; // Return null if the provided path is empty or an error occurs.
        }
    }
}