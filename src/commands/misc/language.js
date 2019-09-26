const { RichEmbed } = require("discord.js");
const langs = ["en_us", "de_de"];

module.exports.run = async (cmd, client, args, message) => {
    if(args.length == 0) {
        displayLanguage();
    } else if(args.length == 1) {
        if(langs.includes(args[0])) {
            updateLanguage(args[0]);
        } else {
            displayError();
        }
    } else {
        displayError();
    }

    function displayLanguage() {
        client.string(message.guild, "command.language.title", (languageTitle) => {
            client.string(message.guild, "command.language.name", (languageName) => {
                client.string(message.guild, "general.footer", (footer) => {
                    let embed = new RichEmbed()
                    .setTitle(client.config.title + " - " + languageTitle + " :globe_with_meridians:")
                    .setDescription(languageName)
                    .setColor(client.config.color)
                    .setFooter(client.config.title + " ● " + footer.replace("$user", message.author.tag));
                    message.channel.send(embed);
                });
            });
        });
    }
    function displayError() {
        client.string(message.guild, "command.language.title", (languageTitle) => {
            client.string(message.guild, "command.language.error", (languageError) => {
                client.string(message.guild, "general.footer", (footer) => {
                    let langString = langs.join(", ") 
                    let embed = new RichEmbed()
                    .setTitle(client.config.title + " - " + languageTitle)
                    .setDescription(languageError.replace("$langs", "`" + langString + "`"))
                    .setColor(client.config.color)
                    .setFooter(client.config.title + " ● " + footer.replace("$user", message.author.tag));
                    message.channel.send(embed);
                });
            });
        });
    }
    function updateLanguage(langId) {
        client.string(message.guild, "command.language.success", (languageSucess) => {
            client.string(message.guild, "command.language.title", (languageTitle) => {
                client.string(message.guild, "general.error", (error) => {
                    client.string(message.guild, "general.footer", (footer) => {
                        client.database.query("UPDATE `guilds_settings` SET `language`=? WHERE `guild` = ? LIMIT 1;", [langId, message.guild.id], (err, results) => {
                            if(err) {
                                client.log.error("[G" + message.guild.id + "] Error occured while updating language: " + err, "C_LANGUAGE")
                                let embed = new RichEmbed()
                                .setTitle(client.config.title + " - " + languageTitle)
                                .setDescription(error.replace("$error", "```An error occured while updating MySQL Data. Info will be logged to the console. Please DM Bot administrator for help.```"))
                                .setColor(client.config.color)
                                .setFooter(client.config.title + " ● " + footer.replace("$user", message.author.tag));
                                message.channel.send(embed);
                            } else {
                                let embed = new RichEmbed()
                                .setTitle(client.config.title + " - " + languageTitle)
                                .setDescription(languageSucess.replace("$lang", "`" + langId + "`"))
                                .setColor(client.config.color)
                                .setFooter(client.config.title + " ● " + footer.replace("$user", message.author.tag));
                                message.channel.send(embed);
                            }
                        });
                    });
                });
            });
        });
    }
};

module.exports.help = {
    name: "language",
    description: "command.language.description",
    usage: "command.language.usage"
}