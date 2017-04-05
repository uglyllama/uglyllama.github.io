var unarmed = [];
var blade = [];
var bow = [];
var shield = [];
var magic = [];

var defaultUnarmed = [];
var defaultBlade = [];
var defaultBow = [];
var defaultShield = [];
var defaultMagic = [];

function Move(args) {
    this.name = args["name"];
    this.type = args["type"];
    this.weapon = args["weapon"] || "unarmed";
    this.power = args["power"];
    this.ailments = args["ailments"];
    this.priority = args["priority"] || 0;
    this.critRate = args["critRate"] || 0;
    this.AP = args["AP"] || 0;

    this.requiredProf = args.requiredProf || 0;

    if(this.requiredProf) eval(this.weapon).push(this);

    this.description = args.description;
}

// Ya'll motherfuckers know what this is
var moveStruggle = new Move({
    name: "STRUGGLE",
    type: "physical",
    weapon: "unarmed",
    power: 50,
    AP: 0,

    ailments: {
        recoil: 100
    }
});

/*-----
Unarmed
-----*/

var movePunch = new Move({
    name: "PUNCH",
    type: "physical",
    weapon: "unarmed",
    power: 30,
    AP: 5,

    description: "A simple punch."
});

var moveBite = new Move({
    name: "BITE",
    type: "physical",
    weapon: "unarmed",
    power: 30,
    AP: 5,

    description: "A fierce bite."
});

var moveSweepKick = new Move({
    name: "SWEEP KICK",
    type: "physical",
    weapon: "unarmed",
    power: 40,
    AP: 7,
    requiredProf: 10,

    description: "The user sweeps their opponent's leg, catching them off-guard."
});

var moveUppercut = new Move({
    name: "UPPERCUT",
    type: "physical",
    weapon: "unarmed",
    power: 50,
    AP: 10,
    requiredProf: 15,

    ailments: {
        paralyze: 20
    },

    description: "An uppercut to the opponent's chin, potentially stunning them."
});

var moveTrample = new Move({
    name: "TRAMPLE",
    type: "physical",
    weapon: "unarmed",
    power: 50,
    AP: 10,

    ailments: {
        paralyze: 20
    },

    description: "The user tramples over their enemy, beating and battering them."
});

/*----
Blades
----*/

var moveStab = new Move({
    name: "STAB",
    type: "physical",
    weapon: "blade",
    power: 50,
    AP: 8,
    requiredProf: 5,

    description: "A painful stab."
});

/*--
Bows
--*/

var moveQuickDraw = new Move({
    name: "QUICK DRAW",
    type: "physical",
    weapon: "bow",
    power: 45,
    AP: 8,
    requiredProf: 5,

    priority: 1,

    description: "The user's range and agility allows them to strike more quickly than usual."
});

/*---
Magic
---*/

var moveEnergyBlast1 = new Move({
    name: "ENERGY BLAST I",
    type: "special",
    weapon: "magic",
    power: 50,
    AP: 10,
    requiredProf: 5,

    description: "The user releases a blast of energy from their palms, knocking their opponents back."
});

function unlockMoves(prof) {
    var moveArray = eval(prof);

    for(var i=0; i<moveArray.length; i++) {
        var move = moveArray[i];

        if(move.requiredProf <= character[prof +"Prof"]) {
            moveArray.splice(i, 1);
            learnMove(move);
        }
    }
}

function learnMove(move) {
    if(character.moveset.length < 4) {
        character.moveset.push(move);
        bottomNotify("You have learned a new "+ move.weapon +" skill: "+ move.name, "success");
        enableCombatUI();
    } else {
        eval(move.weapon).push(move);
    }
}