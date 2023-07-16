using System.Collections;
using System.Collections.Generic;
using NUnit.Framework;
using NUnit.Framework.Internal;
using UnityEngine;
using UnityEngine.SceneManagement;
using UnityEngine.TestTools;

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
    }
    
    [UnityTest]
    public IEnumerator MonoBehaviourTest_Works()
    {
        yield return new MonoBehaviourTest<TestCPU>();
    }
    
    [TearDown]
    public void PostTest()
    {
        Debug.Log("PostTest");
        Application.Quit();
    }
}
