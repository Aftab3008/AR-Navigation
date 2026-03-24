using System.Collections;
using System.Linq;
using UnityEngine;
using UnityEngine.AI;

/**
  * Visualizes path between two points on NavMesh in AR with steps that walk in front of you.
  *
  * Path is calculated every 0.1 second, Source: https://docs.unity3d/com/ScriptReference/AI.NavMesh.CalculatePath.html
  */

public class FootprintController : MonoBehaviour
{
    public static FootprintController instance;
    Camera ARCamera;

    // Footsteps
    public Footprinter printer;
    public float FEET_SPAWN_DISTANCE = 0.5f; // distance from player to footsteps

    // path of agent
    NavMeshPath path;

    // timer
    float _elapsed = 0.0f;

    // start and destination transforms
    Transform a = null;
    Transform b = null;

    void Awake()
    {
        ARCamera = Camera.main;
        instance = this;
    }

    private void Start()
    {
        path = new NavMeshPath();
    }

    void Update()
    {
        if (a != null && b != null && ARStateController.instance.IsLocalized())
        {
            StartCoroutine(PlaceFootprinter(path));

            // Calculate fastest way only every 0.1 second, because it is heavy calculation
            _elapsed += Time.deltaTime;
            if (_elapsed > 0.1f)
            {
                _elapsed -= 0.1f;
                NavMesh.CalculatePath(a.position, b.position, NavMesh.AllAreas, path);
            }
        }

        if (a != null && b != null && ARNavController.instance.IsCurrentlyNavigating())
        {
            if (path.status == NavMeshPathStatus.PathPartial || path.status == NavMeshPathStatus.PathInvalid)
            {
                // handle unreachable route
                NotificationController.instance.ShowNewNotification("Problem calculating route. Please contact the publisher (see imprint).");
                ARNavController.instance.StopNavigation();
            }
        }
    }

    /**
    * Drag footprinter along the agent path
    */
    IEnumerator PlaceFootprinter(NavMeshPath path)
    {
        yield return new WaitForEndOfFrame(); // wait for path to be drawn

        if (path.corners.Length < 2) // if the path has 1 or no corners, there is no need
            yield break;

        float pathDistanceIterationTotal = 0;
        bool isCalculatingPath = false; // true when looping over multiple corners to build path
        for (var i = 0; i < path.corners.Length - 1; i++)
        {
            Vector3 currentCorner = path.corners[i];
            Vector3 nextCorner = path.corners[i + 1];
            // only update feet when there is a path nad it's not the last corner


            float currentPathPartDistance = Vector3.Distance(currentCorner, nextCorner);
            pathDistanceIterationTotal = pathDistanceIterationTotal + currentPathPartDistance;
            //Debug.Log("Distance: " + pathDistanceIterationTotal);
            //Debug.Log("i:" + i);

            if (pathDistanceIterationTotal < FEET_SPAWN_DISTANCE)
            {
                isCalculatingPath = true;
                continue;
            }

            Vector3 spawnPoint;
            if (currentPathPartDistance > FEET_SPAWN_DISTANCE && !isCalculatingPath)
            {
                // path part is longer than spawn distance
                spawnPoint = LerpByDistance(currentCorner, nextCorner, FEET_SPAWN_DISTANCE);
            }
            else
            {
                // good to place!
                // distance is same or further than spawn distance
                float previousDistance = pathDistanceIterationTotal - currentPathPartDistance;
                float remainngDistance = FEET_SPAWN_DISTANCE - previousDistance;
                spawnPoint = LerpByDistance(currentCorner, nextCorner, remainngDistance);
            }

            // position the printer
            printer.gameObject.transform.position = new Vector3(spawnPoint.x, spawnPoint.y, spawnPoint.z);

            break;
        }
    }


    // SETTERS

    public void SetPositionFrom(Transform from)
    {
        a = from;
    }

    public void SetPositionTo(Transform to)
    {
        b = to;

        if (b != null)
        {
            // already calculate because it calculates only every 0.1 second
            NavMesh.CalculatePath(a.position, b.position, NavMesh.AllAreas, path);
        }
    }

    // Get point between to points by distance x
    // source: https://discussions.unity.com/t/find-a-point-on-a-line-between-two-vector3/479348/2
    public Vector3 LerpByDistance(Vector3 A, Vector3 B, float x)
    {
        Vector3 P = x * Vector3.Normalize(B - A) + A;
        return P;
    }

    /**
     * Reset path.
     */
    public void ResetSteps()
    {
        StopAllCoroutines();
        a = null;
        b = null;
        printer.RemoveFootPrints();
    }


}
