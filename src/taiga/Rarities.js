const Rarity = require("./Rarity");

/**
 * A collection of Rarities
 */
class Rarities {
    constructor() {
        /**
         * The array of rarities
         * @type {Array<Rarity>}
         * @private
         */
        this._rarities = [];
    }

    /**
     * This adds a rarity to the collection
     * @param {Rarity} rarity The rarity which should be added to the collection
     */
    add(rarity) {
        this._rarities.push(rarity);
    }

    /**
     * This returns the rarities as an array
     * @return {Array<Rarity>}
     */
    array() {
        return this._rarities;
    }
}

module.exports = Rarities;