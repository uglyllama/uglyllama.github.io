var world = {
    explore: function() {

    },

    forest1: {
        name: "The Forest",

        discovered: true,

        levelRange: "1-5",

        explore: function() {
            var result = randomFromInterval(1, 100);

            if(result <= 25) {
                // Fight Rat
            } else if(result <= 50) {
                // Fight Goblin
            } else if(result <= 60) {
                // Some random thing
            } else if(result <= 70) {
                // Another random thing
            } else {
                // Nothing significant
            }
        }
    },

    forest2: {
        name: "The Deeper Forest",

        discovered: false,

        levelRange: "5-10",

        explore: function() {

        }
    }
};