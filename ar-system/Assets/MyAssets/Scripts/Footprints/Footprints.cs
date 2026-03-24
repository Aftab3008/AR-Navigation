using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Footprints : MonoBehaviour
{

    public GameObject leftFoot;

    public GameObject rightFoot;

    // Start is called before the first frame update
    void Start()
    {

    }

    // Update is called once per frame
    void Update()
    {

    }

    public void EnableLeftFoot(bool isEnabled)
    {
        leftFoot.SetActive(isEnabled);
    }

    public void EnableRightFoot(bool isEnabled)
    {
        rightFoot.SetActive(isEnabled);
    }
}
