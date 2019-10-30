const database = require("./database");

/**
 * A Trading Card
 */
module.exports.TradingCard = class {
    /**
     * Checks if a trading card with the specified id exists.
     * @param {?number} id The trading card ID
     * @returns {?boolean}
     * @example
     * (TradingCard.validateId(1)) ? console.log("Trading card exists") : console.log("Trading card doesn't exist");
    */
    static validateId(id) {
        return new Promise((resolve, reject) => {
            database.query("SELECT * FROM tc_cards WHERE id = ? LIMIT 1", [id], async (error, results) => {
                if(!results.length == 0) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            });
        });
    }

    constructor(id, internalName, displayName, imageName, owners, maxOwners, description, stringName, rarity) {
        /**
         * The ID of the Trading Card
         * @type {?number}
         */
        this.id = id;

        /**
         * The internal name of the Trading Card
         * @type {?string}
         */
        this.internalName = internalName;

        /**
         * The display name of the Trading Card
         * @type {?string}
         */
        this.displayName = displayName;

        /**
         * The image name of the Trading Card
         * @type {?string}
         */
        this.imageName = imageName;

        /**
         * The owner amount of the Trading Card
         * @type {?number}
         */
        this.owners = owners;

        /**
         * The maximum owner amount of the Trading Card
         * @type {?number}
         */
        this.maxOwners = maxOwners;

        /**
         * The description of the Trading Card
         * @type {?string}
         */
        this.description = description;

        /**
         * The string name of the Trading Card's display name
         * @type {?string}
         */
        this.stringName = stringName;

        /**
         * The rarity of the trading card
         * @type {Rarity}
         */
        this.rarity = rarity;
    }

    /**
     * This creates a new Trading Card Instance 
     * @param {?number} id The trading card ID
    */
    static async init(id) {
        return new Promise((resolve, reject) => {
            database.query("SELECT * FROM tc_cards WHERE id = ? LIMIT 1", [id], async (error, results) => {
                let id = (results.length != 0) ? results[0].id : 0;
                let internalName = (results.length != 0) ? results[0].internalName : "invalid";
                let displayName = (results.length != 0) ? results[0].displayName : "Invalid";
                let imageName = (results.length != 0) ? this.internalName + ".png" : "invalid.png";
                let owners = (results.length != 0) ? results[0].owners : 0;
                let maxOwners = (results.length != 0) ? results[0].maxOwners : 0;
                let description = (results.length != 0) ? results[0].description : "Invalid Trading Card";
                let stringName = (results.length != 0) ? "tradingcards.rarity." + this.internalName : "tradingcards.rarity.invalid";
                let rarity = await module.exports.Rarity.init(0);
                if(await module.exports.Rarity.validateId((results.length != 0) ? results[0].rarity : 0)) {
                    rarity = await module.exports.Rarity.init(results[0].rarity);
                }
                resolve(new module.exports.TradingCard(id, internalName, displayName, imageName, owners, maxOwners, description, stringName, rarity));
            });
        });
    }
}

/**
 * A Rarity for Trading Cards
 */
module.exports.Rarity = class {
    /**
     * Checks if a rarity with the specified id exists.
     * @param {?number} id The rarity ID
     * @returns {?boolean}
     * @example
     * (Rarity.validateId(3)) ? console.log("Rarity exists") : console.log("Rarity doesn't exist");
    */
    static validateId(id) {
        return new Promise((resolve, reject) => {
            database.query("SELECT * FROM tc_rarities WHERE id = ? LIMIT 1", [id], async (error, results) => {
                if(!results.length == 0) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            });
        });
    }

    constructor(id, internalName, backgroundFile, priority, chance) {
        /**
         * The ID of the Rarity
         * @type {?number}
         */
        this.id = id;

        /**
         * The internal name of the Rarity
         * @type {?string}
         */
        this.internalName = internalName;

        /**
         * The internal name of the Rarity
         * @type {?string}
         */
        this.backgroundFile = backgroundFile;

        /**
         * The priority name of the Rarity
         * @type {?number}
         */
        this.priority = priority;

        /**
         * The chance of the Rarity
         * @type {Chance}
         */
        this.chance = chance;
    }
    
    /**
     * This creates a new Rarity Instance 
     * @param {?number} id The trading card ID
    */
    static async init(id) {
        return new Promise((resolve, reject) => {
            database.query("SELECT * FROM tc_rarities WHERE id = ? LIMIT 1", [id], async (error, results) => {
                let id = (results.length != 0) ? results[0].id : 0;
                let internalName = (results.length != 0) ? results[0].internalName : "invalid";
                let backgroundFile = (results.length != 0) ? "bg_" + this.internalName + ".png" : "bg_common.png";
                let priority = (results.length != 0) ? results[0].priority : 0;
                let chance = (results.length != 0) ? new module.exports.Chance(results[0].chance) : new module.exports.Chance(0);
                resolve(new module.exports.Rarity(id, internalName, backgroundFile, priority, chance));
            });
        })
    }
}

/**
 * A chance for drops of trading cards. If the given value is higher than 100, it will be 100.
 */
module.exports.Chance = class {
    /**
    * @param {?number} value The chance value
    */
    constructor(value) {
        if(!value > 100) {
            this.chance = value;
        } else {
            this.chance = 100;
        }
    }
}