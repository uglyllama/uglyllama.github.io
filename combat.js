$(function() {
    $("#fightMonster").click(function(e) {
        var menu = document.getElementById("monsterList");
        var selectedMonster = menu.options[menu.selectedIndex].value;

        startCombat(monsters.list[selectedMonster]);
    });

    $("#skillButtons").on("click", "button", function(e) {
        if(inCombat) {
            if(character.moveset[this.name].AP <= character.AP) continueCombat(character.moveset[this.name]);
            else printToCombatLog("You don't have enough AP!");
        } else printToCombatLog("You are not in combat!");
    });

    $("#struggle").click(function(e) {
        if(inCombat) {
            continueCombat(moveStruggle);
        } else printToCombatLog("You are not in combat!");
    });

    enableCombatUI();
    disableCombatUI();
});

function updateSkillButtons() {
    var outOfAP = true;

    $(".skillButton button").each(function() {
        $(this).html(character.moveset[this.name].name +"<br />"+ character.moveset[this.name].AP +" AP");
        if(character.moveset[this.name].AP <= character.AP && inCombat) {
            $(this).attr("disabled", false);
            $("#struggleDiv").hide();
            outOfAP = false;
        } else {
            $(this).attr("disabled", true);
        }
    });

    if(outOfAP && inCombat) {
        $("#struggleDiv").show();
        $("#skillButtons").hide();
    } else $("#skillButtons").show();
}

var inCombat = false;
var enemy;

// Player selects monster to fight
function startCombat(mon) {
    if(inCombat) {
        printToCombatLog("You are already in combat!");
        return;
    }
    inCombat = true;

    $("#fightMonster").attr("disabled", true);

    $("#combatLog").empty();

    enemy = $.extend(true, {}, mon);
    calculateEnemyStats();
    enemy.HP = enemy.maxHP;

    enableCombatUI();

    printToCombatLog("You are attacked by "+ enemy.name +"!");

    if(inCombat) {
        for(var i=0; i<character.moveset.length; i++) {
            if(character.moveset[i].AP > 0) return;
        }

        continueCombat(moveStruggle);
    }
}

function continueCombat(move) {
    if(!inCombat) {
        printToCombatLog("You are not in combat!", "danger");
        endCombat();
        return;
    }

    var playerMove = move;
    var enemyMove = enemy.moveset[randomFromInterval(0, enemy.moveset.length-1)];

    var playerSpeed = calculateCombatSpeed(character);
    var enemySpeed = calculateCombatSpeed(enemy);
    var first = "";

    if(randomFromInterval(0,1)) first = "player";
    else first = "enemy";

    if(playerSpeed > enemySpeed) first = "player";
    else if(enemySpeed > playerSpeed) first = "enemy";

    if(playerMove.priority > enemyMove.priority) first = "player";
    else if(enemyMove.priority > playerMove.priority) first = "enemy";

    switch(first) {
        case "player":
            doPlayerAttack(playerMove);
            doEnemyAttack(enemyMove);
            break;
        case "enemy":
            doEnemyAttack(enemyMove);
            doPlayerAttack(playerMove);
            break;
        default:
            doPlayerAttack(playerMove);
            doEnemyAttack(enemyMove);
            break;
    }

    if(inCombat) {
        for(var i=0; i<character.moveset.length; i++) {
            if(character.moveset[i].AP > 0) {
                return;
            }
        }

        continueCombat(moveStruggle);
    }
}

function doPlayerAttack(move) {
    if(!inCombat) return;

    // BEGIN PRE-ATTACK AILMENTS CHECKING

    if(character.ailments.indexOf("paralyzed") !== -1) {
        if(randomFromInterval(1,4) === 1) {
            character.ailments.splice(character.ailments.indexOf("paralyzed"), 1);
            printToCombatLog("You are no longer paralyzed!");
        } else {
            if(randomFromInterval(1,4) === 1) {
                printToCombatLog("You tried to attack, but couldn't fight off your paralysis!");
                return;
            }
        }
    }

    // END AILMENTS CHECKING

    character.AP -= move.AP;
    updateSkillButtons();

    var attackResult = calculateDamage(move, character, enemy);

    var damage = attackResult[0];
    var didCrit = attackResult[1];

    var summary = "You used <strong>"+ move.name +"</strong>!";

    character.gainProfXP(character.equipped.weapon.weaponType);

    if(didCrit) summary += " <strong>CRITICAL HIT!</strong>";

    summary += " It inflicted "+ damage +" damage!";

    printToCombatLog(summary);
    enemy.HP -= damage;

    // BEGIN POST-ATTACK AILMENTS APPLYING

    if(move.hasOwnProperty("ailments") && move.ailments !== undefined) {
        if(move.ailments.hasOwnProperty("recoil")) {
            if(randomFromInterval(1,100) <= move.ailments.recoil) {
                character.setHP(character.HP - Math.round(damage/4));
                printToCombatLog("You take "+ Math.round(damage/4) +" <strong>RECOIL DAMAGE!</strong>");
            }
        } else if(move.ailments.hasOwnProperty("paralyze")) {
            if(randomFromInterval(1, 100) <= move.ailments.paralyze) {
                if(enemy.ailments.indexOf("paralyzed") === -1) enemy.ailments.push("paralyzed");
                printToCombatLog(enemy.name +" is now <strong>paralyzed!</strong>");
            }
        }
    }

    // END AILMENTS CHECKING

    updateHealthBars();
    checkCombatEnd();
}

function doEnemyAttack(move) {
    if(!inCombat) return;

    // BEGIN PRE-ATTACK AILMENTS CHECKING

    if(enemy.ailments.indexOf("paralyzed") !== -1) {
        if(randomFromInterval(1,4) === 1) {
            enemy.ailments.splice(enemy.ailments.indexOf("paralyzed"), 1);
            printToCombatLog(enemy.name +"is no longer paralyzed!");
        } else {
            if(randomFromInterval(1,4) === 1) {
                printToCombatLog(enemy.name +" tried to attack, but couldn't fight off their paralysis!");
                return;
            }
        }
    }

    // END AILMENTS CHECKING

    var attackResult = calculateDamage(move, enemy, character);

    var damage = attackResult[0];
    var didCrit = attackResult[1];

    var summary = enemy.name +" used <strong>"+ move.name +"</strong>!";

    if(didCrit) summary += " <strong>CRITICAL HIT!</strong>";

    summary += " It inflicted "+ damage +" damage!";

    printToCombatLog(summary);
    character.setHP(character.HP - damage);

    // BEGIN POST-ATTACK AILMENTS APPLYING

    if(move.hasOwnProperty("ailments") && move.ailments !== undefined) {
        if(move.ailments.hasOwnProperty("recoil")) {
            if(randomFromInterval(1,100) <= move.ailments.recoil) {
                enemy.HP -= Math.round(damage/4);
                printToCombatLog(enemy.name +" takes "+ Math.round(damage/4) +" <strong>RECOIL DAMGE!</strong>");
            }
        } else if(move.ailments.hasOwnProperty("paralyze")) {
            if(randomFromInterval(1, 100) <= move.ailments.paralyze) {
                if(character.ailments.indexOf("paralyzed") === -1) character.ailments.push("paralyzed");
                printToCombatLog("You are now <strong>PARALYZED!</strong>");
            }
        }
    }

    // END AILMENTS CHECKING

    updateHealthBars();
    checkCombatEnd();
}

function calculateDamage(move, user, target) {
    var damage = 0;
    var multiplier = 1;
    var critStage = 0;
    var attack = 0;
    var defense = 0;

    if(move.type === "physical") {
        attack = user.attack + user.attackMod;
        defense = target.defense + target.defenseMod;
    }
    else {
        attack = user.spA + user.spAMod;
        defense = target.spD + target.spDMod;
    }

    critStage += move.critRate;

    if(randomFromInterval(1, Math.round(16/((critStage*2) || 1))) === 1) multiplier++;

    damage = Math.floor( ( ( ( (2 * user.level / 5 + 2) * attack * move.power / defense ) / 10 ) + 2 ) * randomFromInterval(85, 100)/100);

    return [damage*multiplier, multiplier > 1];
}

function checkCombatEnd() {
    if(character.HP <= 0) endCombat("lose");
    else if(enemy.HP <= 0) endCombat("win");
}

function endCombat(result) {
    inCombat = false;
    enemy.HP = 0;
    disableCombatUI();

    switch(result) {
        case "win":
            printToCombatLog("<strong>Victory!</strong>");
            character.enemiesKilled++;
            var rewardMultiplier = 1;
            var range = (5/80)*enemy.level + 3.75;
            if(character.level < enemy.level-range || character.level > enemy.level+range) {
                rewardMultiplier = enemy.level / character.level;
            }

            var XPGain = randomFromInterval( Math.round(enemy.level * 8 * 0.9) , Math.round(enemy.level * 8 * 1.1) );
            XPGain = Math.round(XPGain * rewardMultiplier);
            character.gainXP(XPGain);

            var goldGain = randomFromInterval( Math.round(enemy.level * 9 * 0.9) , Math.round(enemy.level * 9 * 1.1) );
            goldGain = Math.round(goldGain * rewardMultiplier);
            character.gainGold(goldGain);

            printToCombatLog("You gained "+ XPGain +" experience!");
            printToCombatLog("<strong>You found the following on the corpse:</strong>");
            printToCombatLog(goldGain +" gold");

            for(var i=0; i<enemy.lootTable.length; i++) {
                if(Math.random() < enemy.lootTable[i][1]/100) {
                    character.gainItem(enemy.lootTable[i][0]);
                    printToCombatLog(enemy.lootTable[i][0].name);
                }
            }

            break;
        case "lose":
            printToCombatLog("<strong>Defeat!</strong>");
            character.timesDied++;
            var goldLoss = randomFromInterval( Math.round(character.gold * 0.1 * 0.9) , Math.round(character.gold * 0.1 * 1.1) );
            printToCombatLog("You dropped "+ goldLoss +" gold in your rush to run away!");
            character.gold -= goldLoss;
            character.HP = character.maxHP;
            break;
        default:
            break;
    }

    $("#fightMonster").attr("disabled", false);
}

function enableCombatUI() {
    $("#skillButtons").empty();

    for(var i=0; i<character.moveset.length; i++) {
        var $skillButtonDiv = $(document.createElement("div"));
        $skillButtonDiv.attr({
            class: "col-md-6 skillButton"
        });

        var $skillButton = $(document.createElement("button"));
        $skillButton.attr({
            type: "button",
            class: "btn btn-primary btn-lg btn-block",
            name: i
        });

        if(character.moveset[i].AP <= 0) $skillButton.attr("disabled", true);

        $skillButtonDiv.append($skillButton);

        $("#skillButtons").append($skillButtonDiv);
    }

    updateSkillButtons();

    updateHealthBars();
    $("#healthBars").show();
}

function disableCombatUI() {
    $(".skillButton button").each(function() {
        $(this).attr("disabled", true);
    });
    $("#struggleDiv").hide();
    //$("#healthBars").hide();
    $("#enemyHealth").css("width", "0%");
}

function printToCombatLog(text) {
    var $newLine = $(document.createElement("li"));
    $newLine.attr({
        class: "list-group-item"
    });

    $newLine.html(text);

    $("#combatLog").append($newLine);

    $("#combatLog").scrollTop($("#combatLog")[0].scrollHeight);
}

function calculateEnemyStats() {
    enemy.maxHP = Math.round(randomFromInterval( enemy.maxHP * 0.8 , enemy.maxHP * 1.1 ));
    enemy.attack = Math.round(randomFromInterval( enemy.attack * 0.8 , enemy.attack * 1.1 ));
    enemy.spA = Math.round(randomFromInterval( enemy.spA * 0.8 , enemy.spA * 1.1 ));
    enemy.defense = Math.round(randomFromInterval( enemy.defense * 0.8 , enemy.defense * 1.1 ));
    enemy.spD = Math.round(randomFromInterval( enemy.spD * 0.8 , enemy.spD * 1.1 ));
    enemy.speed = Math.round(randomFromInterval( enemy.speed * 0.8 , enemy.speed * 1.1 ));
}

function updateHealthBars() {
    var playerHealth = ""+ Math.round((character.HP / character.maxHP) * 100);
    $("#playerHealth").css("width", playerHealth +"%");
    $("#playerHealth").html("HP: "+ Math.floor(character.HP) +" / "+ character.maxHP);

    var playerAP = ""+ Math.round((character.AP / character.maxAP) * 100);
    $("#playerAP").css("width", playerAP +"%");
    $("#playerAP").html("AP: "+ Math.floor(character.AP) +" / "+ character.maxAP);

    if(enemy) {
        var enemyHealth = ""+ Math.round((enemy.HP / enemy.maxHP) * 100);
        $("#enemyHealth").css("width", enemyHealth +"%");
        $("#enemyHealth").html(enemy.HP +" / "+ enemy.maxHP)
    }
}

function calculateCombatSpeed(mob) {
    var speed = mob.speed + mob.speedMod;

    if(mob.ailments.indexOf("paralyzed") !== -1) speed /= 4;

    return speed;
}