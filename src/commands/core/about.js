const { RichEmbed } = require("discord.js");

module.exports.run = async (cmd, client, args, message) => {
    let embed = new RichEmbed()
        .setTitle(client.config.title + " - " + await client.string(message.guild, "command.about.title"))
        .setDescription(await client.string(message.guild, "command.about.text"))
        .setColor(client.config.color)
        .setFooter(client.config.title + " ● " + (await client.string(message.guild, "general.footer")).replace("$user", message.author.tag));
    message.channel.send(embed);
};

module.exports.help = {
    name: "about",
    description: "command.about.description",
    usage: "command.about.usage"
};