using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using Editor;
using UnityEngine;
using UnityEngine.Profiling;
using Random = UnityEngine.Random;

public class TestCPU : MonoBehaviour
{
    private int _iter = 0;
    private List<int> _list = new List<int>();

    /// <summary>
    /// This is a summary description of the MyMethod.
    /// </summary>
    /// <returns>Description of the return value.</returns>
    public static int Factorial(int n)
    {
        CiProfiler.BeginSample("Factorial");
        int result = 1;
        for (int i = 1; i <= n; i++)
        {
            result *= i;
        }
        Profiler.EndSample();

        return result;
    }

    /// <summary>
    /// This is a summary description of the MyMethod.
    /// </summary>
    /// <returns>Description of the return value.</returns>
    void Update()
    {
        CiProfiler.BeginSample("CustomUpdateRun");
        for (int i = 0; i < 10000; i++)
        {
            _list.Add(Random.Range(int.MinValue, int.MaxValue));
        }

        _iter++;
        Factorial(1000000);
        for (int i = 0; i < 100; i++)
        {
            Debug.Log(_list[i]);
        }

        Debug.Log(_iter);
        Profiler.EndSample();
        _list.Clear();
    }

}
