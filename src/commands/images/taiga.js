const { RichEmbed } = require("discord.js");
const axios = require("axios");

module.exports.run = async (cmd, client, args, message) => {
    axios.get("http://crugg.de:90/api/v1/img_original/taiga/").then(async (response) => {
        let embed = new RichEmbed()
            .setTitle(client.config.title + " - " + await client.string(message.guild, "command.taiga.title"))
            .setImage(response.data.url)
            .setColor(client.config.color)
            .setFooter(client.config.title + " ● " + await client.string(message.guild, "command.taiga.footer") + " ● " + (await client.string(message.guild, "general.footer")).replace("$user", message.author.tag));
        message.channel.send(embed);
    });
};

module.exports.help = {
    name: "taiga",
    description: "command.taiga.description",
    usage: "command.taiga.usage"
};