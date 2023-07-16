using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class TestCPU : MonoBehaviour
{
    private int _iter = 0;
    // Start is called before the first frame update
    void Start()
    {
           
    }

    void Factorial(int n)
    {
        int result = 1;
        for (int i = 1; i <= n; i++)
        {
            result *= i;
        }
    }
    // Update is called once per frame
    void Update()
    {
        if (_iter < 5)
        {
            _iter++;
            Factorial(1000000);
        }
    }
}
