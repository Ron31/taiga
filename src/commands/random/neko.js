const { RichEmbed } = require("discord.js");
const langs = ["en_us", "de_de"];
const axios = require("axios");

module.exports.run = async (cmd, client, args, message) => {
    client.string(message.guild, "command.neko.title", (nekoTitle) => {
        client.string(message.guild, "command.neko.footer", (nekoFooter) => {
            client.string(message.guild, "command.neko.nsfw", (nekoNsfw) => {
                client.string(message.guild, "general.footer", (footer) => {
                    if(!message.channel.nsfw) {
                        let embed = new RichEmbed()
                        .setTitle(client.config.title + " - " + nekoTitle)
                        .setDescription(nekoNsfw)
                        .setColor(client.config.color)
                        .setFooter(client.config.title + " ● " + nekoFooter + " ● " + footer.replace("$user", message.author.tag));
                        message.channel.send(embed);
                    } else {
                        axios.get("https://nekos.life/api/v2/img/neko").then((response) => {
                            let embed = new RichEmbed()
                            .setTitle(client.config.title + " - " + nekoTitle)
                            .setImage(response.data.url)
                            .setColor(client.config.color)
                            .setFooter(client.config.title + " ● " + nekoFooter + " ● " + footer.replace("$user", message.author.tag));
                            message.channel.send(embed);
                        });
                    }
                });
            });
        });
    });
};

module.exports.help = {
    name: "neko",
    description: "command.neko.description",
    usage: "command.neko.usage"
}