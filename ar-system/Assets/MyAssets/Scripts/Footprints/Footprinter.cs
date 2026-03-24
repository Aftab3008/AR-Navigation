using System.Collections;
using System.Collections.Generic;
using System.Linq;
using UnityEngine;

public class Footprinter : MonoBehaviour
{
    [Header("Footprint Settings")]
    public GameObject footprintPrefab;
    public float footprintDistance = 0.4f;
    public float fadeDelay = 2f;

    [Header("Ground Detection")]
    public LayerMask groundLayerMask = 1; // Default layer
    public float groundCheckDistance = 10f;
    public float groundOffset = 0.01f; // Height above ground to prevent flickering

    private Vector3 lastFootprintPosition;
    private Vector3 lastPosition;
    private Vector3 movementDirection;
    private bool isRightFootNext = false;
    private List<FootprintPair> activeFootprints = new List<FootprintPair>();

    public GameObject footprints;

    float distanceMoved = 0;

    private struct FootprintPair
    {
        public GameObject footprintObject;
        public GameObject leftFoot;
        public GameObject rightFoot;
        public Coroutine fadeCoroutine;

        public FootprintPair(GameObject obj, GameObject left, GameObject right)
        {
            footprintObject = obj;
            leftFoot = left;
            rightFoot = right;
            fadeCoroutine = null;
        }
    }

    void Start()
    {
        lastFootprintPosition = transform.position;
        lastPosition = transform.position;
        movementDirection = transform.forward; // Default to forward direction
    }

    void Update()
    {
        CheckForFootprintSpawn();
    }

    void CheckForFootprintSpawn()
    {
        // Update movement direction
        Vector3 currentMovement = transform.position - lastPosition;
        if (currentMovement.magnitude > 0.01f)
        {
            // Project movement to horizontal plane and normalize
            movementDirection = new Vector3(currentMovement.x, 0, currentMovement.z).normalized;
        }
        lastPosition = transform.position;

        distanceMoved = Vector3.Distance(transform.position, lastFootprintPosition);

        if (distanceMoved >= footprintDistance)
        {
            Debug.Log("Spawn both footprints");
            SpawnFootprint();
            lastFootprintPosition = transform.position;
        }
    }

    void SpawnFootprint()
    {
        Vector3 groundPosition = GetGroundPosition();
        if (groundPosition == Vector3.zero) return; // No ground found

        // Create footprint instance
        GameObject newFootprint = Instantiate(footprintPrefab, groundPosition, GetFootprintRotation());
        newFootprint.transform.parent = footprints.transform;

        // Get foot references (assuming they're named "Left Foot" and "Right Foot")
        GameObject leftFoot = newFootprint.transform.Find("Left Foot")?.gameObject;
        GameObject rightFoot = newFootprint.transform.Find("Right Foot")?.gameObject;

        // If not found by name, try getting first two children
        if (leftFoot == null || rightFoot == null)
        {
            if (newFootprint.transform.childCount >= 2)
            {
                leftFoot = newFootprint.transform.GetChild(0).gameObject;
                rightFoot = newFootprint.transform.GetChild(1).gameObject;
            }
        }

        if (leftFoot == null || rightFoot == null)
        {
            Debug.LogError("FootprintSpawner: Could not find left and right foot children in prefab!");
            Destroy(newFootprint);
            return;
        }

        // Initially disable both feet
        leftFoot.SetActive(false);
        rightFoot.SetActive(false);

        // Create footprint pair
        FootprintPair newPair = new FootprintPair(newFootprint, leftFoot, rightFoot);

        // Cancel fade coroutine for the previous last footprint if it exists
        if (activeFootprints.Count > 0)
        {
            FootprintPair lastPair = activeFootprints[activeFootprints.Count - 1];
            if (lastPair.fadeCoroutine != null)
            {
                StopCoroutine(lastPair.fadeCoroutine);
                lastPair.fadeCoroutine = null;
                activeFootprints[activeFootprints.Count - 1] = lastPair;
            }

            // Start fade coroutine for the previous footprint
            lastPair.fadeCoroutine = StartCoroutine(FadeFootprint(lastPair, fadeDelay));
            activeFootprints[activeFootprints.Count - 1] = lastPair;
        }

        // Add to active footprints
        activeFootprints.Add(newPair);

        // Enable the appropriate foot first, then the other
        StartCoroutine(EnableFootSequentially(newPair));
    }

    IEnumerator EnableFootSequentially(FootprintPair footprint)
    {
        // Enable first foot (right or left based on sequence)
        if (isRightFootNext)
        {
            footprint.rightFoot.SetActive(true);
            yield return new WaitForSeconds(0.3f); // Small delay between feet
            footprint.leftFoot.SetActive(true);
        }
        else
        {

            footprint.leftFoot.SetActive(true);
            Debug.Log("Show left");
            if (distanceMoved > footprintDistance / 2)
            {
                Debug.Log("Show right");
                footprint.rightFoot.SetActive(true);
            }
        }

        // Alternate for next footprint
        //isRightFootNext = !isRightFootNext;
    }

    IEnumerator FadeFootprint(FootprintPair footprint, float delay)
    {
        yield return new WaitForSeconds(delay);

        // Remove from active list
        activeFootprints.Remove(footprint);

        // Destroy the footprint
        if (footprint.footprintObject != null)
        {
            Destroy(footprint.footprintObject);
        }
    }

    Vector3 GetGroundPosition()
    {
        RaycastHit hit;
        Vector3 rayStart = transform.position + Vector3.up * 0.5f;

        if (Physics.Raycast(rayStart, Vector3.down, out hit, groundCheckDistance, groundLayerMask))
        {
            return hit.point + Vector3.up * groundOffset;
        }

        // Fallback: use object's Y position projected down with offset
        return new Vector3(transform.position.x, transform.position.y - 1f + groundOffset, transform.position.z);
    }

    Quaternion GetFootprintRotation()
    {
        // Use movement direction for footprint orientation
        if (movementDirection != Vector3.zero)
        {
            return Quaternion.LookRotation(movementDirection);
        }

        // Fallback to object's rotation if no movement
        return Quaternion.Euler(0, transform.eulerAngles.y, 0);
    }

    void OnDrawGizmosSelected()
    {
        // Draw ground check ray
        Gizmos.color = Color.red;
        Vector3 rayStart = transform.position + Vector3.up * 0.5f;
        Gizmos.DrawRay(rayStart, Vector3.down * groundCheckDistance);

        // Draw footprint distance sphere
        Gizmos.color = Color.yellow;
        Gizmos.DrawWireSphere(transform.position, footprintDistance);
    }

    // deletes all children in footprints spawn
    public void RemoveFootPrints()
    {
        // WHY UNITY WHYYY?!
        // This is always crazy and weird to me. With such logic, a parent is also a child of itself… This makes no sense to me. I have to write my own extension method every time…
        // source: https://discussions.unity.com/t/why-is-getcomponentsinchildren-returning-parents-component-aswell/637987/9
        Transform[] children = footprints.GetComponentsInChildren<Transform>().Skip(1).ToArray();
        foreach (var child in children)
        {
            Destroy(child.gameObject);
        }
    }
}