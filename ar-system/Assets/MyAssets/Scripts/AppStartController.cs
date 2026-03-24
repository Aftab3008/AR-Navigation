using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Localization;
using UnityEngine.Localization.Settings;
using TMPro;
using System;
using Unity.VisualScripting;

/**
 * Handles start of app regarding app data.
 */
public class AppStartController : MonoBehaviour
{
    AppData appData;

    SaveScript dataHandler;

    void Awake()
    {

    }

    void Start()
    {
        appData = gameObject.GetComponent<AppData>();

        appData.DataLoaded.AddListener(HandleStartup);

        dataHandler = appData.gameObject.GetComponent<SaveScript>();
        dataHandler.LoadData();
    }

    void HandleStartup()
    {
        Debug.Log("Handle app startup");
        if (appData.IsFirstStartup)
        {
            appData.UserIdentifier = generateUserIdentifier();
            appData.IsFirstStartup = false;
            appData.DeviceModel = SystemInfo.deviceModel;
            appData.DeviceOS = SystemInfo.operatingSystem;
            dataHandler.SaveData();
        }
    }

    // generates an user identifier
    string generateUserIdentifier()
    {
        Guid myuuid = Guid.NewGuid();
        string myuuidAsString = myuuid.ToString();

        UnityEngine.Debug.Log("Your UUID is: " + myuuidAsString);

        return myuuidAsString;
    }

}
