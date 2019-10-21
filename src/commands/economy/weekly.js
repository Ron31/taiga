const { RichEmbed } = require("discord.js");

module.exports.run = async (cmd, client, args, message) => {
    let result = await client.economy.weekly(message.author);
    if(result == true) {
        let embed = new RichEmbed()
        .setTitle(client.config.title + " - " + await client.string(message.guild, "command.weekly.title"))
        .setDescription((await client.string(message.guild, "command.weekly.text")).replace("$coins", "100"))
        .setColor(client.config.color)
        .setFooter(client.config.title + " ● " + (await client.string(message.guild, "general.footer")).replace("$user", message.author.tag));
        message.channel.send(embed);
    } else {
        let embed = new RichEmbed()
        .setTitle(client.config.title + " - " + await client.string(message.guild, "command.weekly.title"))
        .setDescription(await client.string(message.guild, "command.weekly.error"))
        .setColor(client.config.color)
        .setFooter(client.config.title + " ● " + (await client.string(message.guild, "general.footer")).replace("$user", message.author.tag));
        message.channel.send(embed);
    }
};

module.exports.help = {
    name: "weekly",
    description: "command.weekly.description",
    usage: "command.weekly.usage"
};