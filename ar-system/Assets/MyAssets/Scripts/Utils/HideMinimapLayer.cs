using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class HideMinimapLayer : MonoBehaviour
{
    private Camera camera;

    // Start is called before the first frame update
    void Start()
    {
        camera = GetComponent<Camera>();
        camera.cullingMask &= ~LayerMask.GetMask("MinimapOnly");
        // we disable MinimapOnly by script because when we do in editor, the cameras culling mask will start in Mixed mode and not include Physical World (don't know why)
        // source: https://discussions.unity.com/t/enabling-cullingmask-from-script/1562231/2
    }

    // Update is called once per frame
    void Update()
    {
        
    }
}
