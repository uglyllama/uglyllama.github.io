$(function () {
    $(window).keydown(function (e) {
        if (e.keyCode == 13) {
            e.preventDefault();
            return false;
        }
    });

    $("a#changelogTabLink").click(function(e) {
        e.preventDefault();
        $(this).tab("show");
    });

    $("#dismissAll").click(function(e) {
        e.alert("close");
    });

    // INITIALIZE DEFAULTS
    defaultSettings = $.extend(true, {}, settings);
    defaultCharacter = $.extend(true, {}, character);
    defaultPlaceMine = $.extend(true, {}, placeMine);
    defaultUpgrades = $.extend(true, [], upgrades);
    defaultUnarmed = $.extend(true, [], unarmed);
    defaultBlade = $.extend(true, [], blade);
    defaultBow = $.extend(true, [], bow);
    defaultShield = $.extend(true, [], shield);
    defaultMagic = $.extend(true, [], magic);

    loadGame();
    updateGame();
    updateCharacterPanel();
    updateUpgrades();
    checkVersion();

    bottomNotify("This is a VERY early version of the game. It may be riddled with bugs, and saves might break. If you find that your game isn't working properly, try resetting your save. If that doesn't work, please send me a bug report. This message will disappear after 15 seconds.", "warning", 15000);

    ViewModel.character = ko.mapping.fromJS(character);

    ko.applyBindings(ViewModel);
});

var ViewModel = {
    character: ""
};
var VERSION = "0.3.14";

var settings = {
    autoSave: "ON",

    saveInterval: 120000,
    saveTimer: 0,
    timeSinceLastSave: this.saveTimer / 1000,

    versionInterval: 30000,
    versionTimer: 0
};

var defaultSettings;

function updateCharacterPanel() {
    /*var characterTable = $(document.createElement("table"));
    characterTable.attr({
        class: "table table-condensed"
    });
    characterTable.append("<thead><tr><th>"+ character.name +"</th><th></th></tr></thead>");
    characterTable.append("<tbody>" +
        "<tr><td>Level "+ character.level +"</td><td></td></tr>" +
        "<tr><td>"+ Math.floor(character.HP) +" / "+ character.maxHP +" HP</td><td></td></tr>" +
        "<tr><td>"+ character.AP +" / "+ character.maxAP +" AP</td><td></td></tr>" +
        "<tr><td>"+ character.currentXP +" / "+ character.neededXP +" XP</td><td></td></tr>" +
        "<tr><td>&nbsp;</td><td></td></tr>" +
        "<tr><td>Attack</td><td>"+ character.attack +" <span class='text-success'>+"+ character.attackMod +"</span></td></tr>" +
        "<tr><td>Special Attack</td><td>"+ character.spA +" <span class='text-success'>+"+ character.spAMod +"</span></td></tr>" +
        "<tr><td>Defense</td><td>"+ character.defense +" <span class='text-success'>+"+ character.defenseMod +"</span></td></tr>" +
        "<tr><td>Special Defense</td><td>"+ character.spD +" <span class='text-success'>+"+ character.spDMod +"</span></td></tr>" +
        "<tr><td>Speed</td><td>"+ character.speed +" <span class='text-success'>+"+ character.speedMod +"</span></td></tr>" +
        "<tr><td>&nbsp;</td><td></td></tr>" +
        "<tr><td>HP Regen/second</td><td>"+ character.autoheal.toFixed(2) +"</td></tr></tbody>");

    var proficienciesTable = $(document.createElement("table"));
    proficienciesTable.attr({
        class: "table table-condensed"
    });
    proficienciesTable.append("<thead><tr><th>Proficiencies</th><th></th></tr></thead>");
    proficienciesTable.append("<tbody>" +
        "<tr><td>Unarmed</td><td>"+ character.unarmedProf +"</td></tr>" +
        "<tr><td>Blades</td><td>"+ character.bladeProf +"</td></tr>" +
        "<tr><td>Bows</td><td>"+ character.bowProf +"</td></tr>" +
        "<tr><td>Shields</td><td>"+ character.shieldProf +"</td></tr>" +
        "<tr><td>Magic</td><td>"+ character.magicProf +"</td></tr></tbody>");

    var gameStatsTable = $(document.createElement("table"));
    gameStatsTable.attr({
        class: "table table-condensed"
    });
    gameStatsTable.append("<thead><tr><th>Game Stats</th><th></th></tr></thead>");
    gameStatsTable.append("<tbody>" +
        "<tr><td>XP per Click</td><td>"+ character.clickXP +"</td></tr>" +
        "<tr><td>XP per Second</td><td>"+ character.XPS +"</td></tr>" +
        "<tr><td>&nbsp;</td><td></td></tr>" +
        "<tr><td>Gold per Click</td><td>"+ character.clickGold +"</td></tr>" +
        "<tr><td>Gold per Second</td><td>"+ character.GPS +"</td></tr>" +
        "<tr><td>&nbsp;</td><td></td></tr>" +
        "<tr><td>Enemies Killed</td><td>"+ character.enemiesKilled +"</td></tr>" +
        "<tr><td>Times Died</td><td>"+ character.timesDied +"</td></tr>" +
        "<tr><td>&nbsp;</td><td></td></tr>" +
        "<tr><td>Total Clicks</td><td>"+ character.totalClicks +"</td></tr></tbody>");

    $("#charName").html(character.name);
    $("#level").html("Level " + character.level);
    $("#XP").html(Math.round(character.currentXP) + " / " + character.neededXP + " XP");
    $("#gold").html(Math.floor(character.gold).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " gold");

    $("#characterStats").html(characterTable);
    $("#proficiencies").html(proficienciesTable);
    $("#gameStats").html(gameStatsTable);*/

    ko.mapping.fromJS(character, ViewModel.character);
}

function toggleAutoSaving() {
    if (settings.autoSave === "ON") settings.autoSave = "OFF";
    else settings.autoSave = "ON";
}

function updateGame() {
    if(character.XPS) character.gainXP(character.XPS / 10.0);
    if(character.GPS) character.gainGold(character.GPS / 10.0);

    if (settings.versionTimer >= settings.versionInterval) {
        checkVersion();
    }

    settings.versionTimer += 100;

    if (settings.autoSave === "ON") {
        if (settings.saveTimer >= settings.saveInterval) {
            saveGame();
        }
    }

    settings.saveTimer += 100;

    $("#autoSaveStatus").html(settings.autoSave);

    settings.timeSinceLastSave = settings.saveTimer / 1000;
    $("#timeSinceLastSave").html(settings.timeSinceLastSave.toFixed(1));

    if(!inCombat && character.HP < character.maxHP) {
        character.setHP(character.HP + character.autoheal/10);
        if(character.HP > character.maxHP) character.setHP(character.maxHP);
    }

    updateHealthBars();

    if(!$(".alert").length && notifications.length) {
        var note = notifications[0];
        showNotification(note.text, note.type, note.time);
    }

    setTimeout(updateGame, 100);
}

var notifications = [];

function bottomNotify(text, type, time) {
    var note = {
        text: text,
        type: type,
        time: time || 0
    };

    notifications.push(note);
}

function showNotification(text, type, time) {
    var t = time || 3000;
    var notificationBar = $(document.createElement("div"));

    notificationBar.attr({
        class: "alert alert-"+ type +" alert-dismissable col-md-8 col-md-offset-2"
    });
    notificationBar.append("<button type='button' class='close' data-dismiss='alert'>&times;</button>");
    notificationBar.append(text);

    $(".noteContainer").append(notificationBar);
    notifications.shift();
    var n = notificationBar;

    window.setTimeout(function () {
        n.fadeOut("slow", function () {
            n.remove();
        });
    }, t);
}

function newGame() {
    window.localStorage.removeItem("saveState");

    settings = $.extend(true, {}, defaultSettings);
    character = $.extend(true, {}, defaultCharacter);
    placeMine = $.extend(true, {}, defaultPlaceMine);
    upgrades = $.extend(true, [], defaultUpgrades);
    unarmed = $.extend(true, [], defaultUnarmed);
    blade = $.extend(true, [], defaultBlade);
    bow = $.extend(true, [], defaultBow);
    shield = $.extend(true, [], defaultShield);
    magic = $.extend(true, [], defaultMagic);
    $("div#upgradesTab").html('<div id="upgradeCounter"></div>');
    unlockedUpgradesCount = 0;

    character.name = prompt("What is your name?") || "Grabnar";

    updatePlaces();
    monsters.populateList();

    updateInventory();
    updateCharacterPanel();
    updateUpgrades();

    // Do this to make sure correct skills are displayed, otherwise skills from previous save will still be there until combat starts
    enableCombatUI();

    saveGame();
}

function checkVersion() {
    $("#version").html(VERSION);

    var currentVersion = $.ajax({
        url: "version.txt",
        cache: false
    })
        .done(function(d) {
            if(VERSION !== d) {
                $("#versionBar").show();
            }
        });

    var devVersion = $.ajax({
        url: "/rpg-clicker/dev/version.txt",
        cache: false,
    })
        .done(function(d) {
            $("#devVersion").html(d);
        });

    settings.versionTimer = 0;
}

function saveGame() {
    var saveState = {};

    saveState.version = VERSION;

    saveState.character = character;
    saveState.placeMine = placeMine;
    saveState.settings = settings;
    saveState.upgrades = upgrades;
    saveState.unlockedUpgradesCount = unlockedUpgradesCount;
    saveState.unarmed = unarmed;
    saveState.blade = blade;

    window.localStorage.setItem("saveState", JSON.stringify(saveState));

    bottomNotify("Game saved!", "info");

    settings.saveTimer = 0;

    return saveState;
}

function loadGame() {
    var loadState = JSON.parse(window.localStorage.getItem("saveState"));
    var loadEverything = function() {
        for (var prop in loadState.character) {
            character[prop] = loadState.character[prop];
        }
        for (var prop in loadState.placeMine) {
            placeMine[prop] = loadState.placeMine[prop];
        }
        for (var i = 0; i < loadState.upgrades.length; i++) {
            for (var prop in loadState.upgrades[i]) {
                upgrades[i][prop] = loadState.upgrades[i][prop];
            }
            upgrades[i].inList = false;
        }
        unarmed = loadState.unarmed;
        blade = loadState.blade;
        unlockedUpgradesCount = loadState.unlockedUpgradesCount;
        character.calculateGPS();
        settings = loadState.settings;

        updatePlaces();
        monsters.populateList();

        character.fixInventory();
        updateInventory();

        fixSaveFile();
    };

    if (loadState) {
        if(loadState.version !== VERSION) {
            if(confirm("We have detected that your save file is from a different (probably older, or possibly newer if you've been playing the dev version) version of RPG Clicker.\n\n\
Attempting to load this save file could result in unwanted side-effects, including breaking the game, which would require a game reset.\n\n\
Do you want to attempt to load this save file? (Press OK to load, Cancel to start a new game)")) {
                loadEverything();
            } else newGame();
        } else loadEverything();
    } else newGame();

    updatePlaces();

    bottomNotify("Game loaded!", "info");

    return loadState;
}

function randomFromInterval(from, to) {
    return Math.floor(Math.random()*(to-from+1)+from);
}

function fixSaveFile() {
    if(character.equipped.weapon === undefined) character.equipped.weapon = weaponNothing;
    if(character.equipped.body === undefined) character.equipped.body = bodyNothing;
    if(character.equipped.hands === undefined) character.equipped.hands = handsNothing;
    if(character.equipped.feet === undefined) character.equipped.feet = feetNothing;
}

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
};