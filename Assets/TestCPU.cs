using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.TestTools;

public class TestCPU : MonoBehaviour, IMonoBehaviourTest
{
    private int _iter = 0;

    public static int Factorial(int n)
    {
        int result = 1;
        for (int i = 1; i <= n; i++)
        {
            result *= i;
        }

        Debug.Log(result);
        return result;
    }
    // Update is called once per frame
    void Update()
    {
        _iter++;
        Factorial(1000000);
    }

    public bool IsTestFinished
    {
        get
        {
            return _iter > 10;
        }
    }
}
