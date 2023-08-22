using System;
using System.Collections;
using NUnit.Framework;
using Unity.Profiling;
using UnityEngine;
using UnityEngine.Profiling;
using UnityEngine.SceneManagement;
using UnityEngine.TestTools;
using Assert = UnityEngine.Assertions.Assert;


//https://docs.unity3d.com/Packages/com.unity.test-framework@1.1/manual/images/execution-order-unitysetup-teardown.svg
public class PlaymodeTests
{
    [SetUp]
    public void Setup()
    {
        Debug.Log("Setup");
        SceneManager.LoadScene("SampleScene");
    }

    // A Test behaves as an ordinary method
    [Test]
    public void PlaymodeTestsSimplePasses()
    {
        // Use the Assert class to test conditions
        Assert.AreEqual(TestCPU.Factorial(1), 1);
        Assert.AreNotEqual(TestCPU.Factorial(10000000), 1);
        Assert.AreNotEqual(TestCPU.Factorial(500), 1);
    }

    [UnityTest]
    public IEnumerator TestWithFrameExecution()
    {
        // Yield to let the current frame finish
        // Do not use WaitForEndOfFrame because it doesn't work in batchmode
        for(int i = 0; i < 60; i++)
            yield return null;
        Assert.AreNotEqual(TestCPU.Factorial(500), 1);
        yield break;
    }
}
