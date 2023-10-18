using System;
using System.Collections.Generic;
using System.IO;
using UnityEngine;
using UnityEngine.Profiling;

namespace Editor
{
    public static class CiProfiler
    {
        private static HashSet<string> _samples = new HashSet<string>();
        private static string _path = GetProfilerLogParentDirectory(GetProfilerLogFilePath());
        public static void BeginSample(string name)
        {
            if(!_samples.Contains(name) && _path != null)
            {
                _samples.Add(name);
                File.AppendAllText(_path + "/CiProfilerSamples.txt", name + "\n");
            }
            Profiler.BeginSample(name);
        }

        private static string GetProfilerLogFilePath()
        {
            string[] commandLineArgs = Environment.GetCommandLineArgs();
            for (int i = 0; i < commandLineArgs.Length - 1; i++)
            {
                if (commandLineArgs[i] == "-profiler-log-file")
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