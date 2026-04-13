using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Networking;

[Serializable]
public class POIDmData
{
    public string id;
    public string name;
    public float x;
    public float y;
    public float z;
}

public class POIDatabaseFetcher : MonoBehaviour
{
    public static POIDatabaseFetcher instance;
    // The backend URL is now fetched from BackendConfig.Instance.BackendUrl
    // public string backendUrl = "http://localhost:3000/api/venues/college_01/pois";
    
    // Assign the POI Prefab in the Inspector!
    public GameObject poiPrefab;
    
    // We will fire an event when POIs are loaded
    public delegate void OnPOIsLoaded(List<POI> loadedPOIs);
    public event OnPOIsLoaded POIsLoadedEvent;

    private void Awake()
    {
        instance = this;
    }

    public void FetchPOIs(Transform parentSpace)
    {
        StartCoroutine(GetPOIs(parentSpace));
    }

    [SerializeField]
    private string endpoint = "/api/venues/college_01/pois";

    private IEnumerator GetPOIs(Transform parentSpace)
    {
        string fullUrl = BackendConfig.Instance.BackendUrl + endpoint;
        using (UnityWebRequest webRequest = UnityWebRequest.Get(fullUrl))
        {
            yield return webRequest.SendWebRequest();

            if (webRequest.result != UnityWebRequest.Result.Success)
            {
                Debug.LogError("Error fetching POIs: " + webRequest.error);
            }
            else
            {
                string jsonString = webRequest.downloadHandler.text;
                Debug.Log("Fetched POIs: " + jsonString);
                
                // Parse JSON array using JsonHelper
                POIDmData[] poiDataArray = JsonHelper.FromJson<POIDmData>(jsonString);
                List<POI> spawnedPOIs = new List<POI>();
                
                if (poiDataArray != null)
                {
                    foreach (POIDmData data in poiDataArray)
                    {
                        // Instantiate POI Prefab
                        GameObject newPoiObj = Instantiate(poiPrefab, parentSpace);
                        
                        // Set local position relative to the AugmentedSpace
                        newPoiObj.transform.localPosition = new Vector3(data.x, data.y, data.z);
                        newPoiObj.name = "POI_" + data.name;

                        // Setup POI script data
                        POI poiScript = newPoiObj.GetComponent<POI>();
                        if (poiScript != null)
                        {
                            poiScript.poiName = data.name;
                            poiScript.identification = data.id.GetHashCode(); // Temporary conversion to int id if needed
                            spawnedPOIs.Add(poiScript);
                        }
                    }
                }
                
                // Fire event so AugmentedSpace knows it's done
                if (POIsLoadedEvent != null)
                {
                    POIsLoadedEvent(spawnedPOIs);
                }
            }
        }
    }
}

public static class JsonHelper
{
    public static T[] FromJson<T>(string json)
    {
        Wrapper<T> wrapper = JsonUtility.FromJson<Wrapper<T>>("{\"Items\":" + json + "}");
        return wrapper.Items;
    }

    [Serializable]
    private class Wrapper<T>
    {
        public T[] Items;
    }
}
