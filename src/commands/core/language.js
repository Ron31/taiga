const { RichEmbed } = require("discord.js");
const langs = ["en_us", "de_de", "fr_fr"];

module.exports.run = async (cmd, client, args, message) => {
    if(args.length == 0) {
        displayLanguage();
    } else {
        if(message.member.hasPermission("ADMINISTRATOR")) {
            if(args.length == 1) {
                if(langs.includes(args[0])) {
                    updateLanguage(args[0]);
                } else {
                    displayError();
                }
            } else {
                displayError();
            }
        } else {
            displayLanguage();
        }
    }

    async function displayLanguage() {
        let embed = new RichEmbed()
            .setTitle(client.config.title + " - " + await client.string(message.guild, "command.language.title") + " :globe_with_meridians:")
            .setDescription(await client.string(message.guild, "command.language.name"))
            .setColor(client.config.color)
            .setFooter(client.config.title + " ● " + (await client.string(message.guild, "general.footer")).replace("$user", message.author.tag));
        message.channel.send(embed);
    }
    async function displayError() {
        let langString = langs.join(", ")
        let embed = new RichEmbed()
            .setTitle(client.config.title + " - " + await client.string(message.guild, "command.language.title"))
            .setDescription((await client.string(message.guild, "command.language.error")).replace("$langs", "`" + langString + "`"))
            .setColor(client.config.color)
            .setFooter(client.config.title + " ● " + (await client.string(message.guild, "general.footer")).replace("$user", message.author.tag));
        message.channel.send(embed);
    }
    function updateLanguage(langId) {
        client.database.query("UPDATE `guilds_settings` SET `language`=? WHERE `guild` = ? LIMIT 1;", [langId, message.guild.id], async (err, results) => {
            if(err) {
                client.log.error("[G" + message.guild.id + "] Error occured while updating language: " + err, "C_LANGUAGE")
                let embed = new RichEmbed()
                    .setTitle(client.config.title + " - " + await client.string(message.guild, "command.language.title"))
                    .setDescription((await client.string(message.guild, "general.error")).replace("$error", "```An error occured while updating MySQL Data. Info will be logged to the console. Please DM Bot administrator for help.```"))
                    .setColor(client.config.color)
                    .setFooter(client.config.title + " ● " + (await client.string(message.guild, "general.footer")).replace("$user", message.author.tag));
                message.channel.send(embed);
            } else {
                if(!results) client.database.query("INSERT INTO `guilds_settings`(`guild`, `language`, `music`) VALUES ('?','en_us',0)", [message.guild.id]);
                let embed = new RichEmbed()
                    .setTitle(client.config.title + " - " + await client.string(message.guild, "command.language.title"))
                    .setDescription((await client.string(message.guild, "command.language.success")).replace("$lang", "`" + langId + "`"))
                    .setColor(client.config.color)
                    .setFooter(client.config.title + " ● " + (await client.string(message.guild, "general.footer")).replace("$user", message.author.tag));
                message.channel.send(embed);
            }
        });
    }
};

module.exports.help = {
    name: "language",
    description: "command.language.description",
    usage: "command.language.usage"
}