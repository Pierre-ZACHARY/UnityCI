using System.Collections;
using NUnit.Framework;
using UnityEngine;
using UnityEngine.SceneManagement;
using UnityEngine.TestTools;
using Assert = UnityEngine.Assertions.Assert;

//https://docs.unity3d.com/Packages/com.unity.test-framework@1.1/manual/images/execution-order-unitysetup-teardown.svg
public class PlaymodeTests
{
    [UnitySetUp]
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
}
