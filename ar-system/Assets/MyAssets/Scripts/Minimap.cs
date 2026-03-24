using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Minimap : MonoBehaviour
{
    private Transform user;

    public GameObject minimapTexture;

    void Start()
    {
        user = Camera.main.transform;
    }

    void LateUpdate()
    {
        Vector3 userPosition = user.position;
        userPosition.y = transform.position.y;
        transform.position = userPosition;

        minimapTexture.transform.eulerAngles = new Vector3(0, 0, user.transform.eulerAngles.y);
    }
}