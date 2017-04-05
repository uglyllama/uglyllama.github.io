var placeMine = {
    name: "Gold Mine",
    desc: "Allows you to hire workers to mine for gold automatically!",

    id: 1,

    goldBonus: 0,

    cost: 700,
    owned: false,

    numWorkers: 0,
    workerCost: 100,
    goldPerWorker: 0.5,

    pickGrade: 0,
    pickGradeList: ["Wooden",
        "Stone",
        "Iron",
        "Steel",
        "Apprentice",
        "Journeyman",
        "Adept",
        "Expert",
        "Master"],
    upgradeCost: 0,

    hireWorker: function () {
        if (this.workerCost <= character.gold) {
            character.gainGold(-(this.workerCost));
            this.numWorkers++;
            this.workerCost *= 1.1;
            this.workerCost = Math.floor(this.workerCost);
            this.calculateGoldBonus();
            updateDiv(this.generateDiv());
        } else bottomNotify("You can't afford that worker!", "warning");

        character.calculateGPS();
    },

    upgradePick: function () {
        if (this.upgradeCost <= character.gold) {
            character.gainGold(-(this.upgradeCost));
            this.pickGrade++;
            this.calculateGoldBonus();
            updateDiv(this.generateDiv());
        } else bottomNotify("You can't afford that upgrade!", "warning");

        character.calculateGPS();
    },

    generateDiv: function () {
        var thisDiv = $(document.createElement("div"));
        thisDiv.addClass("placeBar");

        thisDiv.attr("id", "place" + this.id);

        thisDiv.append("<div style='font-size:1.3em'>" + this.name + " - " + (this.owned ? 'Owned' : 'Not Owned') + "</div>");
        thisDiv.append("<div>" + this.desc + "</div><br />");
        thisDiv.append("<div>Number of Workers: " + this.numWorkers + "</div>");
        thisDiv.append("<div>Pickaxe Type: " + this.pickGradeList[this.pickGrade] + "</div><br />");

        if (this.owned) {
            var hireButton = document.createElement("input");
            hireButton.type = "button";
            hireButton.className = "btn btn-default";
            hireButton.value = "Hire Worker - " + Math.floor(this.workerCost) + " gold";
            hireButton.onclick = function () {
                placeMine.hireWorker();
            };

            thisDiv.append(hireButton);
        }

        if (!this.owned) {
            var buyButton = document.createElement("input");
            buyButton.type = "button";
            buyButton.className = "btn btn-default";
            buyButton.value = "Buy - " + this.cost + " gold";
            buyButton.onclick = function () {
                if (!placeMine.owned && placeMine.cost <= character.gold) {
                    character.gainGold(-(placeMine.cost));
                    placeMine.owned = true;
                    updateDiv(placeMine.generateDiv());
                }
                else bottomNotify("You can't afford that property!", "warning");
            }

            thisDiv.append(buyButton);
        }

        if (this.owned && this.pickGrade < this.pickGradeList.length - 1) {
            this.upgradeCost = Math.pow((this.pickGrade + 1) * 20, 2) * (this.numWorkers + 1);
            var upgradeButton = document.createElement("input");
            upgradeButton.type = "button";
            upgradeButton.className = "btn btn-default";
            upgradeButton.value = "Upgrade to " + this.pickGradeList[this.pickGrade + 1] + " pickaxes - " + this.upgradeCost + " gold";
            upgradeButton.onclick = function () {        // THIS STUFF RIGHT HERE IS THE WORST CODE I'VE EVER WRITTEN
                placeMine.upgradePick();                // SOMEONE PLEASE EXPLAIN TO ME WHY I COULDN'T JUST DO:
            };                                          // upgradeButton.onclick = placeMine.upgradePick();

            thisDiv.append(upgradeButton);
        }

        return thisDiv;
    },

    calculateGoldBonus: function () {
        this.goldBonus = (this.numWorkers * this.goldPerWorker) * (this.pickGrade + 1);
    }
};

function updatePlaces() {
    $("div#locationTab").empty();
    $("div#locationTab").append(placeMine.generateDiv());
}

function updateDiv(newDiv) {
    if ($("#" + newDiv.attr("id")).length) {
        $("#" + newDiv.attr("id")).replaceWith(newDiv);
    }
    else $("div#locationTab").append(newDiv);
}

var defaultPlaceMine;