using System;
using System.IO;
using UnityEngine;

[Serializable]
public class ConfigData
{
    public string backendUrl;
}

public class BackendConfig : MonoBehaviour
{
    public static BackendConfig Instance { get; private set; }

    [SerializeField]
    private string defaultBackendUrl = "http://localhost:3000";

    public string BackendUrl { get; private set; }

    private void Awake()
    {
        if (Instance != null && Instance != this)
        {
            Destroy(this.gameObject);
            return;
        }

        Instance = this;
        DontDestroyOnLoad(this.gameObject);
        
        LoadConfig();
    }

    private void LoadConfig()
    {
        string filePath = Path.Combine(Application.streamingAssetsPath, "config.json");

        if (File.Exists(filePath))
        {
            try
            {
                string json = File.ReadAllText(filePath);
                ConfigData data = JsonUtility.FromJson<ConfigData>(json);
                BackendUrl = data.backendUrl;
                Debug.Log($"[BackendConfig] Loaded Backend URL: {BackendUrl}");
            }
            catch (Exception ex)
            {
                Debug.LogError($"[BackendConfig] Error parsing config.json: {ex.Message}");
                BackendUrl = defaultBackendUrl;
            }
        }
        else
        {
            Debug.LogWarning("[BackendConfig] config.json not found in StreamingAssets. Using default URL.");
            BackendUrl = defaultBackendUrl;
        }
    }
}
