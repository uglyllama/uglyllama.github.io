var defaultUpgrades = [];

//var nextUpgrades = [];      // Used to store next upgrades to unlock (so the game has a smaller array to loop through every tick)
var upgrades = [            // All upgrades stored in here
    {
        // Name, description, and UNIQUE ID
        name: "Basic Training",
        desc: "You have begun physically conditioning yourself to be faster, stronger, better. You now gain an additional 1 XP per click!",
        id: 1,

        cost: 100,
        bought: false,
        unlocked: false,
        inList: false,

        // What happens when the player successfully buys the upgrade
        buy: function () {
            character.clickXP++;

            character.gainGold(-(this.cost));

            bottomNotify("You now gain " + character.clickXP + " XP per click!", "info");

            this.bought = true;
        },

        // Function that will return whether the player has met all prerequisites for upgrades (to be used later with more complex upgrades)
        unlock: function () {
            return true;
        }
    },

    {
        name: "Scavenger",
        desc: "You have a keen eye for shiny valuables. You now gain an additional 1 gold per click!",
        id: 2,

        cost: 500,
        bought: false,
        unlocked: false,
        inList: false,

        buy: function () {
            character.clickGold++;

            character.gainGold(-(this.cost));

            bottomNotify("You now gain " + character.clickGold + " gold per click!", "info");

            this.bought = true;
        },

        unlock: function () {
            return true;
        }
    },

    {
        name: "Advanced Training",
        desc: "You have been increasing the strain in your training regime. You now gain an additional 2 XP per click!",
        id: 3,

        cost: 500,
        bought: false,
        unlocked: false,
        inList: false,

        buy: function () {
            character.clickXP += 2;

            character.gainGold(-(this.cost));

            bottomNotify("You now gain " + character.clickXP + " XP per click!", "info");

            this.bought = true;
        },

        unlock: function () {
            return true;
        }
    },

    {
        name: "Improved Scavenging Techniques",
        desc: "With practice comes experience. You now gain an additional 2 gold per click!",
        id: 4,

        cost: 1000,
        bought: false,
        unlocked: false,
        inList: false,

        buy: function () {
            character.clickGold += 2;

            character.gainGold(-(this.cost));

            bottomNotify("You now gain " + character.clickGold + " gold per click!", "info");

            this.bought = true;
        },

        unlock: function () {
            return true;
        }
    },

    {
        name: "Extreme Conditioning",
        desc: "Training in extreme conditions and uncontrolled situations has weathered you. You now gain an additional 4 XP per click!",
        id: 5,

        cost: 2000,
        bought: false,
        unlocked: false,
        inList: false,

        buy: function () {
            character.clickXP += 4;

            character.gainGold(-(this.cost));

            bottomNotify("You now gain " + character.clickXP + " XP per click!", "info");

            this.bought = true;
        },

        unlock: function () {
            return true;
        }
    },

    {
        name: "Advanced Scavenging Techniques",
        desc: "Tedious and tiring work has forced you to create advanced methods to optimize energy expenditure. You now gain an additional 4 gold per click!",
        id: 6,

        cost: 2000,
        bought: false,
        unlocked: false,
        inList: false,

        buy: function () {
            character.clickGold += 4;

            character.gainGold(-(this.cost));

            bottomNotify("You now gain " + character.clickGold + " gold per click!", "info");

            this.bought = true;
        },

        unlock: function () {
            return true;
        }
    },

    {
        name: "Master's Training",
        desc: "You wondered how to further yourself, but found that a Master in martial arts was willing to teach you. You now gain an additional 8 XP per click!",
        id: 7,

        cost: 4000,
        bought: false,
        unlocked: false,
        inList: false,

        buy: function () {
            character.clickXP += 8;

            character.gainGold(-(this.cost));

            bottomNotify("You now gain " + character.clickXP + " XP per click!", "info");

            this.bought = true;
        },

        unlock: function () {
            return true;
        }
    },

    {
        name: "Improved Pickaxe Smithing",
        desc: "So many picks broken, all for the cause. But what cause is that? You now gain an additional 8 gold per click!",
        id: 8,

        cost: 4000,
        bought: false,
        unlocked: false,
        inList: false,

        buy: function () {
            character.clickGold += 8;

            character.gainGold(-(this.cost));

            bottomNotify("You now gain " + character.clickGold + " gold per click!", "info");

            this.bought = true;
        },

        unlock: function () {
            return true;
        }
    },

    {
        name: "Master's Approval",
        desc: "Your master has finally seen your skills and has increased training appropriately. You now gain an additional 16 XP per click!",
        id: 9,

        cost: 8000,
        bought: false,
        unlocked: false,
        inList: false,

        buy: function () {
            character.clickXP += 16;

            character.gainGold(-(this.cost));

            bottomNotify("You now gain " + character.clickXP + " XP per click!", "info");

            this.bought = true;
        },

        unlock: function () {
            return true;
        }
    },

    {
        name: "Expert Pickaxe Smithing",
        desc: "Smithing pickaxes is hard, but you're getting better at it. And that's what matters. You now gain an additional 16 gold per click!",
        id: 10,

        cost: 8000,
        bought: false,
        unlocked: false,
        inList: false,

        buy: function () {
            character.clickGold += 16;

            character.gainGold(-(this.cost));

            bottomNotify("You now gain " + character.clickGold + " gold per click!", "info");

            this.bought = true;
        },

        unlock: function () {
            return true;
        }
    },

    {
        name: "Quickened Recovery",
        desc: "Your body is used to be torn down and built up again, and so you can now recover more quickly. You now recover an additional 0.1 HP per second!",
        id: 11,

        cost: 500,
        bought: false,
        unlocked: false,
        inList: false,

        buy: function() {
            character.autoheal += 0.1;

            character.gainGold(-(this.cost));

            bottomNotify("You now recover "+ (character.autoheal).toFixed(2) +" HP per second!", "info");

            this.bought = true;
        },

        unlock: function() {
            return true;
        }
    }
];

var unpurchasedUpgrades = upgrades;

// Variables for the stat line in the Perks panel
var unlockedUpgradesCount = 0;
var totalUpgradesCount = upgrades.length;

/*
 Looks through the upgrades array and finds appropriate upgrades to add to the nextUgprades array
 Arguments: first = the previous upgrade to be unlocked
 Returns: Array containing next cheapest unlockable upgrades

 function prepareNextUpgrades(first) {
 // Remove first from all the arrays
 if(unpurchasedUpgrades.indexOf(first) !== -1) unpurchasedUpgrades.splice(unpurchasedUpgrades.indexOf(first), 1);
 if(nextUpgrades.indexOf(first) !== -1) nextUpgrades.splice(nextUpgrades.indexOf(first), 1);

 // Sort upgrades by cost
 unpurchasedUpgrades.sort(function(a, b) {
 return a.cost - b.cost;
 });

 // Sets nextUpgrades equal to an array containing all ugprades of equal cost to unpurchasedUpgrades[0] (should be cheapest after sorting)
 $.each(unpurchasedUpgrades, function(index, e) {
 if(e) {
 if(e.cost === unpurchasedUpgrades[0].cost) {
 nextUpgrades.push(e);
 unpurchasedUpgrades.splice(unpurchasedUpgrades.indexOf(e), 1);
 }
 }
 });
 }*/

/*
 Updates the upgrades panel. Updates the stat line, creates/updates all of the "windows" for each upgrade, etc.
 Arguments: none
 Returns: none
 */
function updateUpgrades() {
    // Loop through nextUpgrades
    if (upgrades.length) {
        $.each(upgrades, function (index, u) {
            if (u) {
                if (!u.unlocked && u.cost <= character.gold) {
                    u.unlocked = true;
                    unlockedUpgradesCount++;                                                                // Increment counter
                    bottomNotify("New perk unlocked!", "info");
                }

                if (u.unlocked && !u.inList && !u.bought && u.unlock()) {
                    $("div#upgradesTab").append("<div class='upgradeBar' id='upgrade" + u.id + "'></div>");   // Append a div to the Perks panel with class "upgradeBar" and an id of upgradeX where X is the upgrade's unique id

                    var $uDiv = $(".upgradeBar:last");                                                      // jQuery Object uDiv set to last div in panel (the one we just added)
                    $uDiv.append("<span style='font-size:1.3em; color:#EEE;'>" + u.name + "</span><br />");   // Add upgrade name
                    $uDiv.append("<span>" + u.desc + "</span><br /><br />");                                  // Add upgrade description

                    var buyFunction = document.createElement("input");                                      // Create "Buy" button
                    buyFunction.type = "button";                                                            // Make it a "button"
                    buyFunction.className = "btn btn-default";
                    buyFunction.value = "Buy - " + u.cost + " gold";                                          // Set the text

                    buyFunction.onclick = function () {                                                      // When said button is clicked...
                        if (u.cost <= character.gold) {                                                      // Check if player can afford it
                            u.buy();                                                                            // Execute upgrade's buy function
                            $uDiv.fadeOut("fast", function () {                                                  // Fade the div out
                                $uDiv.remove();                                                                     // Then delete it
                            });
                        }
                        else bottomNotify("You don't have enough gold!", "warning");                                   // Otherwise taunt the player
                    };

                    $uDiv.append(buyFunction);                                                              // Add buy button

                    u.inList = true;

                    //prepareNextUpgrades(u);                                                                 // Run prepareNextUpgrades with u
                }
            }
        });
    }

    // Update stat line
    $("#upgradeCounter").html(unlockedUpgradesCount + " of " + totalUpgradesCount + " perks unlocked<br />");
}