/**
 * A Rarity for Trading Cards
 */
class Rarity {
    /**
     * Checks if a rarity with the specified id exists.
     * @param {?number} id The rarity ID
     * @return {?boolean}
     * @static
     * @example
     * (Rarity.validateId(3)) ? console.log("Rarity exists") : console.log("Rarity doesn't exist");
     */
    static validateId(id) {
        return new Promise((resolve, reject) => {
            database.query("SELECT * FROM tc_rarities WHERE id = ? LIMIT 1", [id], async(error, results) => {
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
     * @return {Rarity}
     * @static
     */
    static async init(id) {
        return new Promise((resolve, reject) => {
            database.query("SELECT * FROM tc_rarities WHERE id = ? LIMIT 1", [id], async(error, results) => {
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