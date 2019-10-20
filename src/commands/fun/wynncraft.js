const { RichEmbed } = require("discord.js");
const axios = require("axios");

module.exports.run = async (cmd, client, args, message) => {
    if(args.length == 1) {
        let user = args[0];
        try {
            var result = (await axios.get("https://api.wynncraft.com/v2/player/" + user + "/stats")).data;
        } catch (error) {
            let embed = new RichEmbed()
            .setTitle(client.config.title + " - " + await client.string(message.guild, "command.wynncraft.title"))
            .setDescription(await client.string(message.guild, "command.wynncraft.playerNotFound"))
            .setColor(client.config.color)
            .setFooter(client.config.title + " ● " + await client.string(message.guild, "command.wynncraft.footer") + " ● " + (await client.string(message.guild, "general.footer")).replace("$user", message.author.tag));
            return message.channel.send(embed);
        }
        let embed = new RichEmbed()
        .setTitle(client.config.title + " - " + await client.string(message.guild, "command.wynncraft.title") + ": " + result.data[0].username)
        .addField(await client.string(message.guild, "command.wynncraft.general"), "**" + await client.string(message.guild, "command.wynncraft.general.rank") + ":** " + result.data[0].rank, false)
        .setColor(client.config.color)
        .setFooter(client.config.title + " ● " + await client.string(message.guild, "command.wynncraft.footer") + " ● " + (await client.string(message.guild, "general.footer")).replace("$user", message.author.tag));
        for(index = 0; index < result.data[0].classes.length; index++) {
            let profile = result.data[0].classes[index];
            let title = (await client.string(message.guild, "command.wynncraft.profile")).replace("$number", index + 1);
            let className = "**" + await client.string(message.guild, "command.wynncraft.profile.className") + ":** " + profile.name[0].toUpperCase() + profile.name.substring(1);
            let level = "**" + await client.string(message.guild, "command.wynncraft.profile.level") + ":** " + profile.level;
            let questsCompleted = "**" + await client.string(message.guild, "command.wynncraft.profile.questsCompleted") + ":** " + profile.quests.completed;
            let mobsKilled = "**" + await client.string(message.guild, "command.wynncraft.profile.mobsKilled") + ":** " + profile.mobsKilled;
            let blocksWalked = "**" + await client.string(message.guild, "command.wynncraft.profile.blocksWalked") + ":** " + profile.blocksWalked;
            let logins = "**" + await client.string(message.guild, "command.wynncraft.profile.logins") + ":** " + profile.logins;
            let deaths = "**" + await client.string(message.guild, "command.wynncraft.profile.deaths") + ":** " + profile.deaths;
            let chestsFound = "**" + await client.string(message.guild, "command.wynncraft.profile.chestsFound") + ":** " + profile.chestsFound;
            embed.addField(title, className + "\n" + level + "\n" + questsCompleted + "\n" + mobsKilled + "\n" + blocksWalked + "\n" + logins + "\n" + deaths + "\n" + chestsFound, true);
        };
        message.channel.send(embed);
    } else {
        let embed = new RichEmbed()
        .setTitle(client.config.title + " - " + await client.string(message.guild, "command.wynncraft.title"))
        .setDescription((await client.string(message.guild, "general.syntax")).replace("$command", client.config.prefix + "wynncraft" + await client.string(message.guild, "command.wynncraft.usage")))
        .setColor(client.config.color)
        .setFooter(client.config.title + " ● " + await client.string(message.guild, "command.wynncraft.footer") + " ● " + (await client.string(message.guild, "general.footer")).replace("$user", message.author.tag));
        message.channel.send(embed);
    }
};

module.exports.help = {
    name: "wynncraft",
    description: "command.wynncraft.description",
    usage: "command.wynncraft.usage"
};