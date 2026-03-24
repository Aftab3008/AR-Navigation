using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Runtime.Serialization.Formatters.Binary;
using UnityEngine;

[RequireComponent(typeof(AppData))]
public class SaveScript : MonoBehaviour
{
    private AppData appData;
    private string savePath;

    void Awake()
    {
        appData = GetComponent<AppData>();
        savePath = Application.persistentDataPath + "/appsave.save";
    }

    public void SaveData()
    {
        var save = new Save()
        {
            IsFirstStartup = appData.IsFirstStartup,
            UserIdentifier = appData.UserIdentifier,
            DeviceModel = appData.DeviceModel,
            DeviceOS = appData.DeviceOS
        };

        var binaryFormatter = new BinaryFormatter();
        using (var fileStream = File.Create(savePath))
        {
            binaryFormatter.Serialize(fileStream, save);
        }

        Debug.Log("Data Saved");
    }

    public void LoadData()
    {
        if (File.Exists(savePath))
        {
            Save save;

            var binaryFormatter = new BinaryFormatter();
            using (var fileStream = File.Open(savePath, FileMode.Open))
            {
                save = (Save)binaryFormatter.Deserialize(fileStream);
            }

            appData.IsFirstStartup = save.IsFirstStartup;
            appData.UserIdentifier = save.UserIdentifier;
            appData.DeviceModel = save.DeviceModel;
            appData.DeviceOS = save.DeviceOS;

            Debug.Log("Data Loaded");
        }
        else
        {
            appData.UserIdentifier = "";
            appData.IsFirstStartup = true;
            Debug.Log("File doesn't exist.");
        }
        appData.DataLoaded.Invoke();
    }
}
