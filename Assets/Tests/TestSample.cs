using System.Collections;
using NUnit.Framework;
using UnityEngine;
using UnityEngine.TestTools;

public class TestSample
{
    
    // A Test behaves as an ordinary method
    [Test]
    public void TestSampleSimplePasses()
    {
        // Use the Assert class to test conditions
        Assert.AreEqual(TestCPU.Factorial(1), 1);
        Debug.Log("TestSampleSimplePasses");
        Debug.Log(TestCPU.Factorial(22));
        Assert.AreNotEqual(TestCPU.Factorial(22), 1);
    }

    // A UnityTest behaves like a coroutine in Play Mode. In Edit Mode you can use
    // `yield return null;` to skip a frame.
    [UnityTest]
    [Timeout(30)]
    public IEnumerator TestSampleWithEnumeratorPasses()
    {
        // Use the Assert class to test conditions.
        // Use yield to skip a frame.
        yield return null;
        
        Assert.AreEqual(TestCPU.Factorial(1), 1);
    }
}
