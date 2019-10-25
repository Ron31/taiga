const { RichEmbed } = require("discord.js");

module.exports.run = async (cmd, client, args, message) => {
    let result = await client.economy.monthly(message.author);
    if(result == true) {
        let embed = new RichEmbed()
        .setTitle(client.config.title + " - " + await client.string(message.guild, "command.monthly.title"))
        .setDescription((await client.string(message.guild, "command.monthly.text")).replace("$coins", "750"))
        .setColor(client.config.color)
        .setFooter(client.config.title + " ● " + (await client.string(message.guild, "general.footer")).replace("$user", message.author.tag));
        message.channel.send(embed);
    } else {
        let embed = new RichEmbed()
        .setTitle(client.config.title + " - " + await client.string(message.guild, "command.monthly.title"))
        .setDescription(await client.string(message.guild, "command.monthly.error"))
        .setColor(client.config.color)
        .setFooter(client.config.title + " ● " + (await client.string(message.guild, "general.footer")).replace("$user", message.author.tag));
        message.channel.send(embed);
    }
};

module.exports.help = {
    name: "monthly",
    description: "command.monthly.description",
    usage: "command.monthly.usage"
};