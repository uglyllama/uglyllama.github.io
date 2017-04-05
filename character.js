var defaultCharacter;

var character = {
    name: "",

    level: 1,
    currentXP: 0,
    neededXP: 100,

    HP: 30,
    maxHP: 30,

    AP: 100,
    maxAP: 100,

    attack: 10,
    spA: 10,
    defense: 10,
    spD: 10,
    speed: 10,

    attackMod: 0,
    spAMod: 0,
    defenseMod: 0,
    spDMod: 0,
    speedMod: 0,

    unarmedProf: 1,
    unarmedXP: 0,
    unarmedXPNeeded: 10,
    bladeProf: 1,
    bladeXP: 0,
    bladeXPNeeded: 10,
    bowProf: 1,
    bowXP: 0,
    bowXPNeeded: 10,
    shieldProf: 1,
    shieldXP: 0,
    shieldXPNeeded: 10,
    magicProf: 1,
    magicXP: 0,
    magicXPNeeded: 10,

    ailments: [],

    autoheal: 0.2,

    enemiesKilled: 0,
    timesDied: 0,

    XPS: 0,
    clickXP: 1,

    gold: 0,
    GPS: 0,
    clickGold: 1,

    totalClicks: 0,

    inventory: [],

    equipped: {
        weapon: weaponNothing,
        body: bodyNothing,
        hands: handsNothing,
        feet: feetNothing
    },

    moveset: [movePunch],

    setHP: function(amount) {
        this.HP = amount;
        updateCharacterPanel();
    },

    gainProfXP: function(prof) {
        this[prof +"XP"]++;
        if(this[prof +"XP"] >= this[prof +"XPNeeded"]) {
            this[prof +"Prof"]++;
            this[prof +"XP"] = 0;
            this[prof +"XPNeeded"] *= 1.1;
            bottomNotify("Your "+ prof +" proficiency has increased!", "success");

            unlockMoves(prof);
        }
    },

    levelUp: function () {
        this.level++;
        this.neededXP = this.level * 100;
        this.currentXP = 0;

        var stats = ["attack", "spA", "defense", "spD", "speed"];

        var whichStats = [];

        while(whichStats.length < 3) {
            var which = randomFromInterval(0, stats.length-1);

            if(whichStats.indexOf(which) === -1) whichStats.push(which);
        }

        for(var i=0; i<whichStats.length; i++) {
            var k = whichStats[i];

            this[stats[k]] += randomFromInterval(2, 4);
        }

        this.maxHP += randomFromInterval(2, 4);
        this.maxAP += randomFromInterval(4, 8);

        this.HP = this.maxHP;
        this.AP = this.maxAP;

        enableCombatUI();

        updateCharacterPanel();
        bottomNotify("Level up! You are now level " + this.level, "success");
    },

    fixInventory: function() {
        for(var i= 0; i<this.inventory.length; i++) {
            var item = this.inventory[i];

            switch(item.type) {
                case "consumable":
                    item.effect = consumableList[item.id].effect;
            }
        }
    },

    gainItem: function(item) {
        if(searchInventory(item) === -1) this.inventory.push(item);

        this.inventory[searchInventory(item)].quantity++;

        updateInventory();
    },

    gainXP: function (num) {
        this.currentXP += num;
        if (this.currentXP >= this.neededXP) this.levelUp();
        updateCharacterPanel();
    },

    gainGold: function (num) {
        this.gold += num;
        updateUpgrades();
        updateCharacterPanel();
    },

    clickXPButton: function() {
        this.gainXP(this.clickXP);
        this.totalClicks++;
    },

    clickGoldButton: function() {
        this.gainGold(this.clickGold);
        this.totalClicks++;
    },

    calculateGPS: function () {
        this.GPS =
            placeMine.goldBonus;
    },

    learnMove: function(move) {
        this.moveset.push(move);
    },

    calculateStatMods: function() {
        this.attackMod = 0;
        this.spAMod = 0;
        this.defenseMod = 0;
        this.spDMod = 0;
        this.speedMod = 0;

        for(var key in this.equipped) {
            var item = this.equipped[key];

            this.attackMod += item.attackMod;
            this.spAMod += item.spAMod;
            this.defenseMod += item.defenseMod;
            this.spDMod += item.spDMod;
            this.speedMod += item.speedMod;
        }
    }
};

function cheat() {
    while(character.level < 100) character.levelUp();
}