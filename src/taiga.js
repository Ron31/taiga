const database = require("./utils/database");
const { Client, Collection, User } = require("discord.js");
const logg = require("logg.js");
const db = require("./utils/database");
const config = require("./config.json");
const { Connection } = require("mysql2");

/**
 * The main Client which is based on discord.js's Client.
 */
class TaigaClient extends Client {
    constructor(options = {}) {
        super(options);

        /**
         * A Collection of Commands
         * @type {Collection<*>}
         */
        this.commands = new Collection();

        /**
         * An array of Groups
         * @type {Array<*>}
         */
        this.groups = [];

        /**
         * logg.js Instance
         * @type {Object<Function>}
         */
        this.log = logg;

        /**
         * mysql2 Database Instance
         * @type {Connection}
         */
        this.database = db;

        /**
         * Configuration File
         * @type {Object<*>}
         */
        this.config = config;

        /**
         * List of main languages
         * @type {Array<string>}
         */
        this.languages = [];

        /**
         * List of experimental languages
         * @type {Array<string>}
         */
        this.experimentalLanguages = [];

        /**
         * Taiga EconomyUtility Instance
         * @type {EconomyUtility}
         */
        this.economy = new module.exports.EconomyUtility(this.database);
    }

    /**
     * Adds commas to a number every 3 characters
     * @param {?number} number The original number
     * @return {?string}
    */
    numberWithCommas(number) {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    /**
     * Gets a string in the language of the specified guild.
     * @param {Guild} guild The Guild that should be used for the language
     * @param {?string} string The name of the String
     * @return {Promise<?string>}
    */
    string(guild, string) {
        return new Promise(function (resolve, reject) {
            database.query("SELECT * FROM `guilds_settings` WHERE `guild` = ?", [guild.id], (err, results) => {
                if(!results[0]) {
                    let lang = "en_us";
                    database.query("INSERT INTO `guilds_settings`(`guild`, `language`, `music`) VALUES (?,?,?)", [guild.id, lang, false]);
                    let langFile = require("./languages/" + lang + ".json");
                    if(!langFile[string]) {
                        resolve("[String not found: " + string + "]");
                    } else {
                        resolve(langFile[string]);
                    }
                } else {
                    let lang = results[0].language;
                    let langFile = require("./languages/" + lang + ".json");
                    if(langFile[string]) {
                        resolve(langFile[string]);
                    } else {
                        lang = "en_us";
                        langFile = require("./languages/" + lang + ".json");
                        if(langFile[string]) {
                            resolve(langFile[string]);
                        } else {
                            resolve("[String not found: " + string + "]");
                        }
                    }
                }
            });
        });
    }
}

/**
 * Class for Economy Utilities. This should only be used inside the TaigaClient Class.
 */
class EconomyUtility {
    constructor(connection) {
        this.connection = connection;
    }

    /**
     * Give coins to the specified user
     * @param {User} user The user which should get the coins
     * @param {?number} amount The amount of coins
     * @return {Promise<?boolean>}
    */
    addCoins(user, amount) {
        return new Promise(function (resolve, reject) {
            this.connection.query("SELECT * FROM users_money WHERE user = ? LIMIT 1", [user.id], async (err, results) => {
                if(!results[0]) {
                    this.connection.query("INSERT INTO `users_money`(`user`, `taigacoins`, `economyban`) VALUES (?,?,0)", [user.id, amount]);
                    resolve(true);
                } else {
                    let originalMoney = results[0]["taigacoins"];
                    this.connection.query("UPDATE `users_money` SET `taigacoins` = ? WHERE `user` = ?", [originalMoney + amount, user.id]);
                    resolve(true);
                }
            });
        });
    }

    /**
     * Remove coins from the specified user
     * @param {User} user The user which should loose the coins
     * @param {?number} amount The amount of coins
     * @return {Promise<?boolean>}
    */
    removeCoins(user, amount) {
        return new Promise(function (resolve, reject) {
            this.connection.query("SELECT * FROM users_money WHERE user = ? LIMIT 1", [user.id], async (err, results) => {
                if(!results[0]) {
                    this.connection.query("INSERT INTO `users_money`(`user`, `taigacoins`, `economyban`) VALUES (?,?,0)", [user.id, -amount]);
                    resolve(true);
                } else {
                    let originalMoney = results[0]["taigacoins"];
                    this.connection.query("UPDATE `users_money` SET `taigacoins` = ? WHERE `user` = ?", [originalMoney - amount, user.id]);
                    resolve(true);
                }
            });
        });
    }

    /**
     * Get coins of the specified user
     * @param {User} user The user which should loose the coins
     * @return {Promise<?number>}
    */
    getCoins(user) {
        return new Promise(function (resolve, reject) {
            this.connection.query("SELECT * FROM users_money WHERE user = ? LIMIT 1", [user.id], async (err, results) => {
                if(!results[0]) {
                    this.connection.query("INSERT INTO `users_money`(`user`, `taigacoins`, `economyban`) VALUES (?,0,0)", [user.id]);
                    resolve(0);
                } else {
                    resolve(parseInt(results[0]["taigacoins"]));
                }
            });
        });
    }
    
    /**
     * Get top ten users
     * @return {Promise<Object<*>>}
    */
    getTopTen() {
        return new Promise(function (resolve, reject) {
            this.connection.query("SELECT * FROM users_money ORDER BY taigacoins DESC LIMIT 10", [], async (err, results) => {
                resolve(results);
            });
        });
    }

    /**
     * Give daily rewards to the specified User
     * @param {User} user The user which should recieve the daily reward
     * @return {Promise<?boolean>}
    */
    daily() {
        return new Promise((resolve, reject) => {
            this.connection.query("SELECT * FROM users_cooldowns WHERE user = ? LIMIT 1", [user.id], async (err, results) => {
                if(!results[0]) {
                    let oldDate = new Date('2017-01-01T00:00:00');
                    let currentDate = new Date();
                    this.connection.query("INSERT INTO `users_cooldowns`(user, hourlyLast, dailyLast, weeklyLast, monthlyLast) VALUES (?, ?, ?, ?)", [user.id, oldDate, currentDate, oldDate, oldDate]);
                    this.addCoins(user, 100);
                    resolve(true);
                } else {
                    if((new Date() - results[0].dailyLast) >= 86400000) {
                        this.connection.query("UPDATE users_cooldowns SET dailyLast = ? WHERE user = ?", [new Date(), user.id]);
                        this.addCoins(user, 100);
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                }
            });
        });
    }

    /**
     * Give weekly rewards to the specified User
     * @param {User} user The user which should recieve the weekly reward
     * @return {Promise<?boolean>}
    */
    weekly() {
        return new Promise((resolve, reject) => {
            this.connection.query("SELECT * FROM users_cooldowns WHERE user = ? LIMIT 1", [user.id], async (err, results) => {
                if(!results[0]) {
                    let oldDate = new Date('2017-01-01T00:00:00');
                    let currentDate = new Date();
                    this.connection.query("INSERT INTO `users_cooldowns`(user, hourlyLast, dailyLast, weeklyLast, monthlyLast) VALUES (?, ?, ?, ?)", [user.id, oldDate, oldDate, currentDate, oldDate]);
                    this.addCoins(user, 250);
                    resolve(true);
                } else {
                    if((new Date() - results[0].weeklyLast) >= 604800000) {
                        this.connection.query("UPDATE users_cooldowns SET weeklyLast = ? WHERE user = ?", [new Date(), user.id]);
                        this.addCoins(user, 250);
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                }
            });
        });
    }


    /**
     * Give monthly rewards to the specified User
     * @param {User} user The user which should recieve the monthly reward
     * @return {Promise<?boolean>}
    */
    monthly() {
        return new Promise((resolve, reject) => {
            this.connection.query("SELECT * FROM users_cooldowns WHERE user = ? LIMIT 1", [user.id], async (err, results) => {
                if(!results[0]) {
                    let oldDate = new Date('2017-01-01T00:00:00');
                    let currentDate = new Date();
                    this.connection.query("INSERT INTO `users_cooldowns`(user, hourlyLast, dailyLast, weeklyLast, monthlyLast) VALUES (?, ?, ?, ?)", [user.id, oldDate, oldDate, oldDate, currentDate]);
                    this.addCoins(user, 750);
                    resolve(true);
                } else {
                    if((new Date() - results[0].monthlyLast) >= 2592000000) {
                        this.connection.query("UPDATE users_cooldowns SET monthlyLast = ? WHERE user = ?", [new Date(), user.id]);
                        this.addCoins(user, 750);
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                }
            });
        });
    }
    
}

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
     * @return {Rarity}
     * @static
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
class Chance {
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

module.exports = { TaigaClient, EconomyUtility, TradingCard, Rarity, Chance }