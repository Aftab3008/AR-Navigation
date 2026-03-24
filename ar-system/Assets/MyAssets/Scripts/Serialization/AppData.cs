using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Events;

public class AppData : MonoBehaviour
{
    public static AppData instance;
    
    void Awake() {
        instance = this;
    }

    public bool IsFirstStartup;
    public string UserIdentifier;

    public string DeviceModel;

    public string DeviceOS;
    public UnityEvent DataLoaded = new UnityEvent();
}
