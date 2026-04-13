using System.Collections;
using UnityEngine;
using UnityEngine.Networking;

/// <summary>
/// This script handles downloading the Unity AssetBundle (containing the Area Target and NavMesh)
/// from the backend and loading it into the scene dynamically.
/// </summary>
public class VenueLoader : MonoBehaviour
{
    public static VenueLoader instance;
    
    // The backend URL is now fetched from BackendConfig.Instance.BackendUrl
    // private string backendUrl = "http://localhost:3000";

    // Event fired when the floor asset bundle is successfully loaded
    public delegate void OnVenueLoaded(GameObject environment);
    public event OnVenueLoaded VenueLoadedEvent;

    private void Awake()
    {
        if (instance == null)
            instance = this;
    }

    /// <summary>
    /// Fetches the AssetBundle from the provided sub-URL and instantiates it into the scene.
    /// </summary>
    /// <param name="assetBundleUrl">The relative URL, e.g., /uploads/bundles/123.bundle</param>
    public void LoadFloorAssetBundle(string assetBundleUrl)
    {
        StartCoroutine(DownloadAndLoadBundle(assetBundleUrl));
    }

    private IEnumerator DownloadAndLoadBundle(string assetBundleUrl)
    {
        string fullUrl = BackendConfig.Instance.BackendUrl + assetBundleUrl;
        Debug.Log("Downloading AssetBundle from: " + fullUrl);

        using (UnityWebRequest webRequest = UnityWebRequestAssetBundle.GetAssetBundle(fullUrl))
        {
            yield return webRequest.SendWebRequest();

            if (webRequest.result != UnityWebRequest.Result.Success)
            {
                Debug.LogError("Failed to download AssetBundle: " + webRequest.error);
            }
            else
            {
                AssetBundle bundle = DownloadHandlerAssetBundle.GetContent(webRequest);
                if (bundle != null)
                {
                    Debug.Log("AssetBundle downloaded successfully!");
                    
                    // We load the main GameObject from the bundle
                    // Ensure your Area Targets are named or tagged consistently so we know what they are. 
                    // Typically, you'd load all assets and pick the first GameObject.
                    GameObject[] prefabs = bundle.LoadAllAssets<GameObject>();
                    
                    if (prefabs.Length > 0)
                    {
                        GameObject envInstance = Instantiate(prefabs[0]);
                        envInstance.name = "Dynamic_Floor_Environment";
                        
                        // Fire event so AugmentedSpace or ARStateController can resume tracking
                        VenueLoadedEvent?.Invoke(envInstance);
                    }
                    else
                    {
                        Debug.LogError("No GameObjects found in AssetBundle.");
                    }

                    // Free memory (true unloads objects that are currently loaded, false keeps loaded active)
                    bundle.Unload(false); 
                }
                else
                {
                    Debug.LogError("AssetBundle was downloaded but is null.");
                }
            }
        }
    }
}
