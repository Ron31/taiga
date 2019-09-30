const { RichEmbed } = require("discord.js");
const axios = require("axios");

module.exports.run = async (cmd, client, args, message) => {
    /*client.string(message.guild, "command.neko.title", (nekoTitle) => {
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
    });*/
    if(!message.channel.nsfw) {
        let embed = new RichEmbed()
            .setTitle(client.config.title + " - " + await client.string(message.guild, "command.neko.title"))
            .setDescription(await client.string(message.guild, "command.neko.nsfw"))
            .setColor(client.config.color)
            .setFooter(client.config.title + " ● " + await client.string(message.guild, "command.neko.footer") + " ● " + (await client.string(message.guild, "general.footer")).replace("$user", message.author.tag));
        message.channel.send(embed);
    } else {
        axios.get("https://nekos.life/api/v2/img/neko").then(async (response) => {
            let embed = new RichEmbed()
                .setTitle(client.config.title + " - " + await client.string(message.guild, "command.neko.title"))
                .setImage(response.data.url)
                .setColor(client.config.color)
                .setFooter(client.config.title + " ● " + await client.string(message.guild, "command.neko.footer") + " ● " + (await client.string(message.guild, "general.footer")).replace("$user", message.author.tag));
            message.channel.send(embed);
        });
    }
};

module.exports.help = {
    name: "neko",
    description: "command.neko.description",
    usage: "command.neko.usage"
};