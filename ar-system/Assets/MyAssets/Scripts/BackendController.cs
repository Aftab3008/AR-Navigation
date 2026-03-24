using System.Collections;
using System.Collections.Generic;
using System.Runtime.CompilerServices;
using UnityEngine;
using UnityEngine.Networking;

public class BackendController : MonoBehaviour
{
    public static BackendController instance;
    public string ServerURL;

    void Awake()
    {
        instance = this;
    }

    public void SendVisitData(POI poi)
    {
        string DataString = "{ \"userIdentifier\": \"" + AppData.instance.UserIdentifier + "\", \"poiID\": \"" + poi.GetId() + "\", \"deviceModel\": \"" + AppData
        .instance.DeviceModel + "\", \"deviceOS\": \"" + AppData.instance.DeviceOS + "\" }";
        StartCoroutine(PostVisitData(DataString));
    }

    IEnumerator PostVisitData(string DataString)
    {
        Debug.Log("DataString: " + DataString);
        var formData = new List<IMultipartFormSection>
        {
            new MultipartFormDataSection(DataString)
        };
        Debug.Log("Form data: " + formData);

        using var www = UnityWebRequest.Post(ServerURL + "/visit", DataString, "application/json");
        yield return www.SendWebRequest();

        if (www.result != UnityWebRequest.Result.Success)
        {
            Debug.Log(www.error);
        }
        else
        {
            Debug.Log("Visit data sent!");
        }
    }

    IEnumerator Upload()
    {
        using (UnityWebRequest www = UnityWebRequest.Post("https://www.my-server.com/myapi", "{ \"field1\": 1, \"field2\": 2 }", "application/json"))
        {
            yield return www.SendWebRequest();

            if (www.result != UnityWebRequest.Result.Success)
            {
                Debug.LogError(www.error);
            }
            else
            {
                Debug.Log("Form upload complete!");
            }
        }
    }
}
