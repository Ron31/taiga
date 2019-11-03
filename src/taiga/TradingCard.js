/**
 * A Trading Card
 */
class TradingCard {
    /**
     * Checks if a trading card with the specified id exists.
     * @param {?number} id The trading card ID
     * @returns {?boolean}
     * @static
     * @example
     * (TradingCard.validateId(1)) ? console.log("Trading card exists") : console.log("Trading card doesn't exist");
     */
    static validateId(id) {
        return new Promise((resolve, reject) => {
            database.query("SELECT * FROM tc_cards WHERE id = ? LIMIT 1", [id], async(error, results) => {
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
            database.query("SELECT * FROM tc_cards WHERE id = ? LIMIT 1", [id], async(error, results) => {
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

module.exports = TradingCard;