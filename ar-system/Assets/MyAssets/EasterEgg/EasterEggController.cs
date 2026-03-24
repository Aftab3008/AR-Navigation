using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using TMPro;

/**
 * Controller of small mini game where user has to find 3 chickens in scene.
 */
public class EasterEggController : MonoBehaviour
{
    public static EasterEggController instance;

    public ChickenBehaviour[] chickens;
    public TextMeshPro frameText;
    public GameObject chickenAchievement1;
    public GameObject chickenAchievement2;
    public GameObject chickenAchievement3;
    public GameObject chickenCoin1;
    public GameObject chickenCoin2;
    public GameObject chickenCoin3;
    public GameObject easterEggUI;
    public GameObject chickenPrefab;
    List<ChickenBehaviour> extraChickens;
    public GameObject spawnPointExtraChickens;
    public NotificationController notificationController;

    private int SPAWNING_CHICKEN_DISTANCE = 5;

    AudioSource gameMusic; // TODO: find copyright free music
    int chickenCount = 0; // how many chickens were found
    bool isActivated = false;
    float _elapsed = 0.0f;

    // Start is called before the first frame update
    void Awake()
    {   
        instance = this;
        gameMusic = GetComponent<AudioSource>();
        HideAchievements();
        HideCoins();
        easterEggUI.SetActive(false);
        extraChickens = new List<ChickenBehaviour>();
    }

    public void ToggleEasterEgg()
    {
        isActivated = !isActivated;
        if (isActivated)
        {
            easterEggUI.SetActive(true);
            //gameMusic.Play();
            ActivateChickens(true);
            frameText.text = "Find the 3 chickens! Best experience with headphones (for 3D sound).";
        }
        else
        {
            easterEggUI.SetActive(false);
            HideCoins();
            //gameMusic.Stop();
            ActivateChickens(false);
            frameText.text = "Don't touch.";
        }
        chickenCount = 0; // reset game
    }

    private void ActivateChickens(bool isChickensActivated)
    {
        foreach (var chicken in chickens)
        {
            chicken.gameObject.SetActive(isChickensActivated);

            if (isChickensActivated)
            {
                chicken.SetIsChickenFound(false); // reset chickens
                chicken.StartBehaviour(SPAWNING_CHICKEN_DISTANCE);
            }
            else
            {
                chicken.CleanUpGrass();
                chicken.transform.localScale = new Vector3(1f, 1f, 1f);
            }
        }

        foreach (ChickenBehaviour extraChicken in extraChickens)
        {
            extraChicken.CleanUpGrass();
            extraChicken.gameObject.SetActive(false);
        }
    }

    private void HideAchievements()
    {
        chickenAchievement1.SetActive(false);
        chickenAchievement2.SetActive(false);
        chickenAchievement3.SetActive(false);
    }

    private void HideCoins()
    {
        chickenCoin1.SetActive(false);
        chickenCoin2.SetActive(false);
        chickenCoin3.SetActive(false);
    }

    public void newChickenFound()
    {
        chickenCount++;
        if (chickenCount == 1)
        {
            chickenCoin1.SetActive(true);
            chickenAchievement1.SetActive(true);
        }
        else if (chickenCount == 2)
        {
            chickenCoin2.SetActive(true);
            chickenAchievement2.SetActive(true);
        }
        else if (chickenCount == 3)
        {
            chickenCoin3.SetActive(true);
            chickenAchievement3.SetActive(true);
            frameText.text = "Congratulations! Now you are the Living Lab Chicken Boss.";
        }
        else if (chickenCount == 103)
        {
            notificationController.ShowNewNotification("Not bad ... Contact us and we will buy you a snickers. And now go back to work!");
            ToggleEasterEgg();
        }
    }

    public void ClickedAchievementOk()
    {
        HideAchievements();
        if (chickenCount == 3)
        {
            // spawn 100 chickens
            for (int i = 0; i < 100; i++)
            {
                GameObject newChicken = GameObject.Instantiate(chickenPrefab, spawnPointExtraChickens.transform.position, Quaternion.identity);
                newChicken.transform.SetParent(transform);
                newChicken.name = "Chicken" + i; // give them unique names so trigger works
                ChickenBehaviour behaviour = newChicken.GetComponent<ChickenBehaviour>();
                behaviour.StartBehaviour(SPAWNING_CHICKEN_DISTANCE);
                extraChickens.Add(behaviour);
            }
        }
    }

    void Update()
    {
        //always check for touchcount first, before checking array
        if (Input.GetMouseButtonDown(0) || (Input.touchCount > 0 && Input.GetTouch(0).phase == TouchPhase.Began))
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
                // raycast collider must be same tag as unique object collider!
                // CAUTION: one time when I added new tag in editor it didn't work until I restarted unity...
                if (raycastHit.collider.name == "EasterEggController")
                {
                    ToggleEasterEgg();
                }
            }
        }

        if (isActivated)
        {
            _elapsed += Time.deltaTime;
            if (_elapsed > 1f)
            {
                _elapsed -= 1f;
                foreach (ChickenBehaviour chicken in chickens)
                {
                    chicken.transform.localScale += new Vector3(0.01f, 0.01f, 0.01f);
                }
            }
        }
    }
}