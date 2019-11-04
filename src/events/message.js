const fs = require("fs");
const { RichEmbed } = require("discord.js");

module.exports = async(client, message) => {
    if (message.author.bot) return;
    if (message.channel.type === "dm") return;
    if (!client.economy.getTimeout(message.author)) {
        let money = Math.random() * (2 - 1) + 1;
        client.economy.addCoins(message.author, money);
        client.economy.startTimeout(message.author, 10000);
    }

    let prefix = client.config.prefix;
    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
    let args = messageArray.slice(1);
    if (!message.content.startsWith(prefix)) return;

    let commandFile = client.commands.get(cmd.slice(prefix.length));
    if (commandFile) {
        if(process.env.TYPE == "development"
        && client.guilds.has(client.config.ownerGuild)
        && !((client.guilds.find(val => val.id == client.config.ownerGuild).members.find(val => val.id == message.author.id) && client.guilds.find(val => val.id == client.config.ownerGuild).members.find(val => val.id == message.author.id).roles.has(client.config.ownerRole)))) return;
        
        if(commandFile.help.tctest == true) {
            if(!client.guilds.has(client.config.ownerGuild)
            || !client.guilds.find(val => val.id == client.config.ownerGuild).members.has(message.author.id)
            || !client.guilds.find(val => val.id == client.config.ownerGuild).members.find(val => val.id == message.author.id).roles.has("640898992934223883")) {
                let embed = new RichEmbed()
                .setTitle(client.config.title)
                .setDescription(await client.string(message.guild, "general.featureTesting"))
                .setColor(client.config.color)
                .setFooter(client.config.title + " ● " + (await client.string(message.guild, "general.footer")).replace("$user", message.author.tag))
                return message.channel.send(embed);
            };
        }
        commandFile.run(cmd, client, args, message);
    }
};