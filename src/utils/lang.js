const database = require("./database");

module.exports = {
    string: function(guild, string) {
        return new Promise(function (resolve, reject) {
            database.query("SELECT * FROM `guilds_settings` WHERE `guild` = ?", [guild.id], (err, results) => {
                if(!results[0]) {
                    let lang = "en_us";
                    database.query("INSERT INTO `guilds_settings`(`guild`, `language`, `music`) VALUES (?,?,?)", [guild.id, lang, false]);
                    let langFile = require("../languages/" + lang + ".json");
                    resolve(langFile[string]);
                } else {
                    let lang = results[0].language;
                    let langFile = require("../languages/" + lang + ".json");
                    resolve(langFile[string]);
                }
            });
        });
    }
}