const { RichEmbed } = require("discord.js");

module.exports.run = async (cmd, client, args, message) => {
    let result = await client.economy.hourly(message.author);
    if(result == true) {
        let embed = new RichEmbed()
        .setTitle(client.config.title + " - " + await client.string(message.guild, "command.hourly.title"))
        .setDescription((await client.string(message.guild, "command.hourly.text")).replace("$coins", "100"))
        .setColor(client.config.color)
        .setFooter(client.config.title + " ● " + (await client.string(message.guild, "general.footer")).replace("$user", message.author.tag));
        message.channel.send(embed);
    } else {
        let embed = new RichEmbed()
        .setTitle(client.config.title + " - " + await client.string(message.guild, "command.hourly.title"))
        .setDescription(await client.string(message.guild, "command.hourly.error"))
        .setColor(client.config.color)
        .setFooter(client.config.title + " ● " + (await client.string(message.guild, "general.footer")).replace("$user", message.author.tag));
        message.channel.send(embed);
    }
};

module.exports.help = {
    name: "hourly",
    description: "command.hourly.description",
    usage: "command.hourly.usage"
};