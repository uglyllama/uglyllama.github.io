// ITEMS

$(function() {
    $("#consumableList").on("click", "button", function(e) {
        var index = +this.name;

        character.inventory[index].effect();

        if(character.inventory[index].quantity <= 0) {
            character.inventory.splice(index, 1);
        }

        updateInventory();
    });

    $("#consumableShopList").on("click", "button", function(e) {
        var index = +this.name;

        buyItem(consumableShop[index]);
    });

    $("#equipmentShopList").on("click", "button", function(e) {
        var index = +this.name;

        buyItem(equipmentShop[index]);
    });

    $("#equipmentList").on("click", "button.equip", function(e) {
        var index = +this.name;

        equipItem(character.inventory[index]);
    });

    $("#equippedList").on("click", "button", function(e) {
        var slot = this.name;

        unequipItem(character.equipped[slot]);
    });

    updateShop();
});

var consumableList = [];
var consumableShop = [];
var equipmentList = [];
var equipmentShop = [];

function Consumable(args) {
    this.type = "consumable";
    this.quantity = 0;
    this.name = args.name;
    this.id = args.id;
    this.effect = args.effect;

    this.description = args.description;

    this.cost = args.cost || 0;

    consumableList.push(this);

    if(args.inShop) consumableShop.push(this);
}

function Equipment(args) {
    this.type = "equipment";
    this.quantity = 0;
    this.name = args.name;
    this.id = args.id;

    this.slot = args.slot;
    this.weaponType = args.weaponType || "unarmed";

    this.attackMod = args.attackMod || 0;
    this.spAMod = args.spAMo || 0;
    this.defenseMod = args.defenseMod || 0;
    this.spDMod = args.spDMod || 0;
    this.speedMod = args.speedMod || 0;

    this.description = args.description || "";

    equipmentList.push(this);
}
/////////////////
// CONSUMABLES //
/////////////////
var potionHP1 = new Consumable({
    name: "Vitality Tincture I",
    id: 0,
    effect: function() {
        if(character.HP < character.maxHP) {
            character.HP += 20;
            if(character.HP > character.maxHP) character.HP = character.maxHP;
            this.quantity--;
            bottomNotify("You have used a Vitality Tincture I", "info");
        } else bottomNotify("You are already at full HP!", "warning");
    },

    description: "Restores 20 HP",

    cost: 100,

    inShop: true
});
var potionAP1 = new Consumable({
    name: "Energy Tincture I",
    id: 1,
    effect: function() {
        if(character.AP < character.maxAP) {
            character.AP += 20;
            if(character.AP > character.maxAP) character.AP = character.maxAP;
            this.quantity--;
            updateSkillButtons();
            bottomNotify("You have used an Energy Tincture I", "info");
        } else bottomNotify("You are already at full AP!", "warning");
    },

    description: "Restores 20 AP",

    cost: 100,

    inShop: true
});
var potionParalyzeHeal = new Consumable({
    name: "Smelling Salts",
    id: 2,
    effect: function() {
        if(character.ailments.indexOf("paralyzed") !== -1) {
            this.quantity--;
            character.ailments.splice(character.ailments.indexOf("paralyzed"), 1);
            bottomNotify("You have cured your paralysis!", "info");
        } else bottomNotify("You are not currently paralyzed!", "warning");
    },

    description: "Cures paralysis",

    cost: 150,

    inShop: true
});

// EQUIPMENT
var weaponNothing = new Equipment({
    name: "Nothing",
    id: 0,
    slot: "weapon",
    description: "You're unarmed!"
});
var bodyNothing = new Equipment({
    name: "Nothing",
    id: 2,
    slot: "body",
    description: "You're naked!"
});
var handsNothing = new Equipment({
    name: "Nothing",
    id: 3,
    slot: "hands",
    description: "Your bare hands!"
});
var feetNothing = new Equipment({
    name: "Nothing",
    id: 4,
    slot: "feet",
    description: "You're barefoot!"
});

////////////
// BLADES //
////////////
var weaponCrackedKnife = new Equipment({
    name: "Cracked Knife",
    id: 1,
    slot: "weapon",
    weaponType: "blade",

    attackMod: 10,

    description: "A cracked knife. Probably not all that effective."
});

//////////
// BOWS //
//////////
var weaponWarpedBow = new Equipment({
    name: "Warped Bow",
    id: 5,
    slot: "weapon",
    weaponType: "bow",

    attackMod: 10,
    speedMod: 5,

    description: "An old bow warped by time."
});

function updateInventory() {
    $("#equipmentList").empty();
    $("#consumableList").empty();

    for(var i=0; i<character.inventory.length; i++) {
        var item = character.inventory[i];

        if(item.quantity <= 0) {
            character.inventory.splice(searchInventory(item), 1);
            continue;
        }

        if(item.type === "consumable") {
            var itemRow = $(document.createElement("tr"));
            itemRow.append("<td>"+ item.name +"</td>");
            itemRow.append("<td>"+ item.quantity +"</td>");

            var useButton = $(document.createElement("button"));
            useButton.attr({
                type: "button",
                class: "btn btn-default btn-xs",
                name: i
            });
            useButton.html("Use");

            itemRow.append($(document.createElement("td")).append(useButton));

            $(itemRow).tooltip({
                placement: "auto",
                title: item.description
            });

            $("#consumableList").append(itemRow);
        } else if(item.type === "equipment" && !item.equipped) {
            var itemRow = $(document.createElement("tr"));
            itemRow.append("<td>"+ item.name +"</td>");
            itemRow.append("<td>"+ item.quantity +"</td>");

            var infoButton = $(document.createElement("button"));
            infoButton.attr({
                type: "button",
                class: "btn btn-default btn-xs"
            });
            infoButton.html("Info");
            infoButton.popover({
                html: true,
                placement: "bottom",
                title: item.name,
                content: item.description +"<dl class='dl-horizontal'>" +
                    "<dt>Attack</dt><dd>"+ item.attackMod +"</dd>" +
                    "<dt>Special Attack</dt><dd>"+ item.spAMod +"</dd>" +
                    "<dt>Defense</dt><dd>"+ item.defenseMod +"</dd>" +
                    "<dt>Special Defense</dt><dd>"+ item.spDMod +"</dd>" +
                    "<dt>Speed</dt><dd>"+ item.speedMod +"</dd></dl>"
            });
            itemRow.append($(document.createElement("td")).append(infoButton));

            var equipButton = $(document.createElement("button"));
            equipButton.attr({
                type: "button",
                class: "btn btn-default btn-xs equip",
                name: i
            });
            equipButton.html("Equip");
            itemRow.append($(document.createElement("td")).append(equipButton));

            $("#equipmentList").append(itemRow);
        }
    }

    for(var key in character.equipped) {
        if(character.equipped.hasOwnProperty(key)) {
            var item = character.equipped[key];
            var itemInfo = $("#equipped"+ item.slot.capitalize() +" .panel-body");

            itemInfo.empty();

            itemInfo.append("<dl><dt>"+ item.name +"</dt><dd>"+ item.description +"</dd></dl>");
            itemInfo.append("<dl class='dl-horizontal'>" +
                "<dt>Attack</dt>" +
                "<dd>"+ item.attackMod +"</dd>" +
                "<dt>Special Attack</dt>" +
                "<dd>"+ item.spAMod +"</dd>" +
                "<dt>Defense</dt>" +
                "<dd>"+ item.defenseMod +"</dd>" +
                "<dt>Special Defense</dt>" +
                "<dd>"+ item.spDMod +"</dd>" +
                "<dt>Speed</dt>" +
                "<dd>"+ item.speedMod +"</dd></dl>");

            if(item.name !== "Nothing") {
                var unequipButton = $(document.createElement("button"));
                unequipButton.attr({
                    class: "btn btn-default btn-block",
                    name: item.slot
                });
                unequipButton.html("Unequip");

                itemInfo.append(unequipButton);
            }
        }
    }
}

function updateShop() {
    for(var i=0; i<consumableShop.length; i++) {
        var item = consumableShop[i];

        var itemRow = $(document.createElement("tr"));
        itemRow.append("<td>"+ item.name +"</td>");
        itemRow.append("<td>"+ item.cost +"</td>");

        var buyButton = $(document.createElement("button"));
        buyButton.attr({
            type: "button",
            class: "btn btn-default btn-xs",
            name: i
        });
        buyButton.html("Buy");

        itemRow.append($(document.createElement("td")).append(buyButton));

        $(itemRow).tooltip({
            placement: "auto",
            title: item.description
        });

        $("#consumableShopList").append(itemRow);
    }

    for(var i=0; i<equipmentShop.length; i++) {
        var item = equipmentShop[i];

        var itemRow = $(document.createElement("tr"));
        itemRow.append("<td>"+ item.name +"</td>");
        itemRow.append("<td>"+ item.cost +"</td>");

        var buyButton = $(document.createElement("button"));
        buyButton.attr({
            type: "button",
            class: "btn btn-default btn-xs",
            name: i
        });
        buyButton.html("Buy");

        itemRow.append($(document.createElement("td")).append(buyButton));

        $(itemRow).tooltip({
            placement: "auto",
            title: item.description
        });

        $("#equipmentShopList").append(itemRow);
    }
}

function buyItem(item) {
    if(item.cost <= character.gold) {
        character.gold -= item.cost;
        character.gainItem(item);
        bottomNotify("You have bought "+ item.name, "info");
    } else bottomNotify("You don't have enough gold!", "warning");
}

function searchInventory(item) {
    for(var i=0; i<character.inventory.length; i++) {
        if(character.inventory[i].id === item.id && character.inventory[i].type === item.type) return i;
    }

    return -1;
}

function unequipItem(item) {
    character.equipped[item.slot] = eval(item.slot +"Nothing");

    if(item.name !== "Nothing") {
        bottomNotify("You have unequipped your "+ item.name, "info");
        character.gainItem(item);
    }

    character.calculateStatMods();

    updateCharacterPanel();
    updateInventory();
}

function equipItem(item) {
    unequipItem(character.equipped[item.slot]);
    character.equipped[item.slot] = item;
    bottomNotify("You have equipped your "+ item.name, "info");
    character.calculateStatMods();

    item.quantity--;

    updateCharacterPanel();
    updateInventory();
}