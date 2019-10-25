const { RichEmbed } = require("discord.js");

module.exports.run = async (cmd, client, args, message) => {
    let result = await client.economy.daily(message.author);
    if(result == true) {
        let embed = new RichEmbed()
        .setTitle(client.config.title + " - " + await client.string(message.guild, "command.daily.title"))
        .setDescription((await client.string(message.guild, "command.daily.text")).replace("$coins", "100"))
        .setColor(client.config.color)
        .setFooter(client.config.title + " ● " + (await client.string(message.guild, "general.footer")).replace("$user", message.author.tag));
        message.channel.send(embed);
    } else {
        let embed = new RichEmbed()
        .setTitle(client.config.title + " - " + await client.string(message.guild, "command.daily.title"))
        .setDescription(await client.string(message.guild, "command.daily.error"))
        .setColor(client.config.color)
        .setFooter(client.config.title + " ● " + (await client.string(message.guild, "general.footer")).replace("$user", message.author.tag));
        message.channel.send(embed);
    }
};

module.exports.help = {
    name: "daily",
    description: "command.daily.description",
    usage: "command.daily.usage"
};