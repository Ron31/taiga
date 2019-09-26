const axios = require("axios");
const con = require("./database");
const log = require("./logging");
const fs = require("fs");

module.exports = {
    string: function(guild, string, callback) {
        con.query("SELECT * FROM `guilds_settings` WHERE `guild` = ?", [guild.id], (err, results) => {
            if(!results[0]) {
                let lang = "en_us";
                con.query("INSERT INTO `guilds_settings`(`guild`, `language`, `music`) VALUES (?,?,?)", [guild.id, lang, false], (err, results) => {});
                let langFile = require("../languages/" + lang + ".json");
                callback(langFile[string]);
            } else {
                let lang = results[0].language;
                let langFile = require("../languages/" + lang + ".json");
                callback(langFile[string]);
            }
        });
    }
}