const { User } = require("discord.js");
const TradingCard = require("./TradingCard");
const database = require("../utils/database");

/**
 * An inventory of trading cards
 */
class Inventory {
    constructor(user, tradingCards) {
        /**
         * The inventory owner
         * @type {User}
         */
        this.user = user;

        /**
         * The array of tradingCards
         * @type {Array<TradingCard>}
         */
        this.tradingCards = tradingCards;
    }

    /**
     * This creates a new Inventory Instance 
     * @param {User} user The user who's inventory should be taken from the database.
     * @return {Inventory}
     * @static
     * @async
     */
    static async init(user) {
        return new Promise((resolve, reject) => {
            let array = [];
            database.query("SELECT * FROM tc_inventory WHERE user = ? ORDER BY id ASC", [user.id], async(error, results) => {
                for(let i = 0; i < results.length; i++) {
                    array.push(await TradingCard.init(results[i]["card"]));
                }
                resolve(new Inventory(user, array));
            });
        });
    }

    /**
     * This adds a trading card to the inventory
     * @param {TradingCard} card The trading card that should be added to the inventory.
     * @return {Promise<Boolean>}
     * @async
     */
    async add(card) {
        return new Promise((resolve, reject) => {
            database.query("INSERT INTO tc_inventory (user, card) VALUES (?, ?)", [this.user.id. card.id], async(error) => {
                if(error) throw error;
                this.tradingCards.push(card);
                resolve(true);
            });
        });
    }
}

module.exports = Inventory;