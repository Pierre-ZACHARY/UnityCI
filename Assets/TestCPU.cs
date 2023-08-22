using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Profiling;
using Random = UnityEngine.Random;

public class TestCPU : MonoBehaviour
{
    private int _iter = 0;
    private List<int> _list = new List<int>();

    public static int Factorial(int n)
    {
        Profiler.BeginSample("Factorial");
        int result = 1;
        for (int i = 1; i <= n; i++)
        {
            result *= i;
        }

        Debug.Log(result);
        Profiler.EndSample();
        return result;
    }
    // Update is called once per frame
    void Update()
    {
            Profiler.BeginSample("CustomUpdateRun");
        for(int i = 0; i < 10000; i++)
        {
            _list.Add(Random.Range(int.MinValue, int.MaxValue));
        }
        _iter++;
        Factorial(1000000);
        for(int i = 0; i < 100; i++)
        {
            Debug.Log(_list[i]);
        }
        Debug.Log(_iter);
        Profiler.EndSample();
        _list.Clear();
    }
}
