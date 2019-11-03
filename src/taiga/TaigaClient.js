const { Client, Collection } = require("discord.js");
const logg = require("logg.js");
const db = require("../utils/database");
const config = require("../config.json");
const { Connection } = require("mysql2");
const EconomyUtility = require("./EconomyUtility");

/**
 * The main Client which is based on discord.js's Client.
 */
module.exports = class extends Client {
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
        this.economy = new EconomyUtility();
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
        return new Promise(function(resolve, reject) {
            db.query("SELECT * FROM `guilds_settings` WHERE `guild` = ?", [guild.id], (err, results) => {
                if(!results[0]) {
                    let lang = "en_us";
                    db.query("INSERT INTO `guilds_settings`(`guild`, `language`, `music`) VALUES (?,?,?)", [guild.id, lang, false]);
                    let langFile = require("../languages/" + lang + ".json");
                    if(!langFile[string]) {
                        resolve("[String not found: " + string + "]");
                    } else {
                        resolve(langFile[string]);
                    }
                } else {
                    let lang = results[0].language;
                    let langFile = require("../languages/" + lang + ".json");
                    if(langFile[string]) {
                        resolve(langFile[string]);
                    } else {
                        lang = "en_us";
                        langFile = require("../languages/" + lang + ".json");
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