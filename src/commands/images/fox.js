const { RichEmbed } = require("discord.js");
const axios = require("axios");

module.exports.run = async (cmd, client, args, message) => {
    axios.get("https://randomfox.ca/floof/").then(async (response) => {
        let embed = new RichEmbed()
            .setTitle(client.config.title + " - " + await client.string(message.guild, "command.fox.title"))
            .setImage(response.data.image)
            .setColor(client.config.color)
            .setFooter(client.config.title + " ● " + await client.string(message.guild, "command.fox.footer") + " ● " + (await client.string(message.guild, "general.footer")).replace("$user", message.author.tag));
        message.channel.send(embed);
    });
};

module.exports.help = {
    name: "fox",
    description: "command.fox.description",
    usage: ""
};