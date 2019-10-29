const { RichEmbed } = require("discord.js");

module.exports.run = async (cmd, client, args, message) => {
    let embed = new RichEmbed()
    .setTitle(client.config.title + " - " + await client.string(message.guild, "command.hourly.title"))
    .setDescription((await client.string(message.guild, "command.hourly.removed")))
    .setColor(client.config.color)
    .setFooter(client.config.title + " ● " + (await client.string(message.guild, "general.footer")).replace("$user", message.author.tag));
    message.channel.send(embed);
};

module.exports.help = {
    name: "hourly",
    description: "command.hourly.description",
    usage: "",
    hidden: true
};