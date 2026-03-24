using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.AI;

/**
 * Chicken with following behaviour:
 * - Looks around for 2-8 seconds
 * - Walks to a random destination and eats there for 2-5 seconds
 * - Repeat
 * - When chicken is found by user it disappears
 * - TODO: When player comes nearer 2 Meters it runs to random destination.
 */
public class ChickenBehaviour : MonoBehaviour
{
    public GameObject grassPrefab;
    public GameObject body;

    Animator chickenAnimation;
    NavMeshAgent chickenAgent;
    AudioSource sound;
    List<GameObject> grassHolder;

    int walkHash = Animator.StringToHash("Walk");
    int runHash = Animator.StringToHash("Run");
    int eatHash = Animator.StringToHash("Eat");
    int turnHeadHash = Animator.StringToHash("Turn Head");

    float walkingSpeed = 0.5f;
    float runningSpeed = 5f;
    float runRadius = 10;
    float walkRadius = 5;
    float lookAndEatTimer = 8f;
    bool isChickenFound = false;

    // Start is called before the first frame update
    void Awake()
    {
        grassHolder = new List<GameObject>();
        chickenAnimation = GetComponent<Animator>();
        chickenAgent = GetComponent<NavMeshAgent>();
        chickenAgent.isStopped = true;
        sound = GetComponent<AudioSource>();
        body.SetActive(false);
    }

    public void StartBehaviour(int spawnRadius)
    {
        if (spawnRadius > 0)
        {
            transform.position = RandomNavmeshLocation(spawnRadius);
        }
        body.SetActive(true);
        StartCoroutine(TurnHeadAndMakeSound());
    }

    void Update()
    {
        if (!chickenAgent.pathPending && (chickenAnimation.GetBool(walkHash) || chickenAnimation.GetBool(runHash)))
        {
            if (chickenAgent.remainingDistance <= chickenAgent.stoppingDistance)
            {
                if ((!chickenAgent.hasPath || chickenAgent.velocity.sqrMagnitude == 0f) && !chickenAnimation.GetBool(eatHash))
                {
                    // chicken arrives at destination, and starts eating
                    StartCoroutine(Eat());
                }
            }
        }

        //always check for touchcount first, before checking array
        if (gameObject.activeSelf && (Input.GetMouseButtonDown(0) || (Input.touchCount > 0 && Input.GetTouch(0).phase == TouchPhase.Began)))
        {
            Ray raycast;
            if (Input.touchCount > 0)
            {
                raycast = Camera.main.ScreenPointToRay(Input.GetTouch(0).position);
            }
            else
            {
                raycast = Camera.main.ScreenPointToRay(Input.mousePosition);
            }

            if (Physics.Raycast(raycast, out RaycastHit raycastHit))
            {
                if (raycastHit.collider.name == gameObject.name)
                {
                    HandleCatch();
                }
            }
        }
    }

    /**
     * Eats for random time and then calls TurnHead().
     */
    IEnumerator Eat()
    {
        sound.Stop();
        chickenAgent.speed = walkingSpeed;
        chickenAnimation.SetBool(walkHash, false);
        chickenAnimation.SetBool(runHash, false);
        chickenAnimation.SetBool(eatHash, true);
        float counter = Random.Range(2, lookAndEatTimer);
        while (counter > 0)
        {
            yield return new WaitForSeconds(1);
            counter--;
        }
        chickenAnimation.SetBool(eatHash, false);
        StartCoroutine(TurnHeadAndMakeSound());
    }

    /**
     * Turns head and makes sound for random time and then calls WalkSomeWhere().
     */
    IEnumerator TurnHeadAndMakeSound()
    {
        StopCoroutine(Eat());
        chickenAnimation.SetBool(turnHeadHash, true);
        sound.Play();
        float counter = Random.Range(2, lookAndEatTimer);
        while (counter > 0)
        {
            yield return new WaitForSeconds(1);
            counter--;
        }
        sound.Stop();
        chickenAnimation.SetBool(turnHeadHash, false);
        WalkSomeWhere();
    }

    void WalkSomeWhere()
    {
        StopCoroutine(TurnHeadAndMakeSound());
        chickenAnimation.SetBool(walkHash, true);
        chickenAgent.destination = RandomNavmeshLocation(walkRadius);
        chickenAgent.isStopped = false;
    }

    /**
     * Handles catch of chicken.
     */
    void HandleCatch()
    {
        if (!isChickenFound)
        {
            CleanUpGrass();
            SetIsChickenFound(true);
            EasterEggController.instance.newChickenFound();
            gameObject.SetActive(false);
        }
    }

    /**
     * Detect if user hit a chicken.
     */
    void OnTriggerEnter(Collider other)
    {
        if (other.gameObject.name == "AR Camera")
        {
            RunAway();
        }
    }

    void RunAway()
    {
        StopAllCoroutines();
        sound.Play();
        chickenAgent.destination = RandomNavmeshLocation(runRadius);
        chickenAgent.isStopped = false;
        chickenAgent.speed = runningSpeed;
        chickenAnimation.SetBool(turnHeadHash, false);
        chickenAnimation.SetBool(walkHash, false);
        chickenAnimation.SetBool(eatHash, false);
        chickenAnimation.SetBool(runHash, true);
    }

    public Vector3 RandomNavmeshLocation(float radius)
    {
        Vector3 randomDirection = Random.insideUnitSphere * radius;
        randomDirection += transform.position;
        NavMeshHit hit;
        Vector3 finalPosition = Vector3.zero;
        if (NavMesh.SamplePosition(randomDirection, out hit, radius, NavMesh.AllAreas))
        {
            finalPosition = hit.position;
        }
        transform.LookAt(finalPosition);
        GameObject newGrass = GameObject.Instantiate(grassPrefab, finalPosition, Quaternion.identity);
        newGrass.transform.SetParent(EasterEggController.instance.transform);
        grassHolder.Add(newGrass);
        return finalPosition;
    }

    public void SetIsChickenFound(bool isFound)
    {
        isChickenFound = isFound;
    }

    public void CleanUpGrass()
    {
        foreach (GameObject grass in grassHolder)
        {
            grass.SetActive(false);
        }
    }
}
