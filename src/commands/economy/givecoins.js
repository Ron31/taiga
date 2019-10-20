const { RichEmbed } = require("discord.js");
const util = require("util");

module.exports.run = async (cmd, client, args, message) => {
    if(args.length == 2 && !isNaN(args[1])) {
        try {
            let author = message.author;
            let amount = parseInt(args[1]);
            if(message.mentions.members.size == 1) {
                var target = message.mentions.members.first().user;
            } else {
                if(message.guild.members.find(val => val.user.username == args[0])) {
                    var target = message.guild.members.find(val => val.user.username == args[0]).user;
                } else {
                    let embed = new RichEmbed()
                    .setTitle(client.config.title + " - " + await client.string(message.guild, "command.give.title"))
                    .setDescription((await client.string(message.guild, "general.userNotFound")))
                    .setColor(client.config.color)
                    .setFooter(client.config.title + " ● " + (await client.string(message.guild, "general.footer")));
                    return message.channel.send(embed);
                }
            }
            if(await client.economy.getCoins(author) >= amount) {
                await client.economy.removeCoins(author, amount);
                await client.economy.addCoins(target, amount);
                let embed = new RichEmbed()
                .setTitle(client.config.title + " - " + await client.string(message.guild, "command.give.title"))
                .setDescription((await client.string(message.guild, "command.give.given")).replace("$amount", amount).replace("$target", target.tag).replace("$author", author.tag))
                .setColor(client.config.color)
                .setFooter(client.config.title + " ● " + (await client.string(message.guild, "general.footer")).replace("$user", message.author.tag));
                return message.channel.send(embed);
            } else {
                let embed = new RichEmbed()
                .setTitle(client.config.title + " - " + await client.string(message.guild, "command.give.title"))
                .setDescription((await client.string(message.guild, "command.give.notEnoughMoney")).replace("$target", target.tag).replace("$amount", amount))
                .setColor(client.config.color)
                .setFooter(client.config.title + " ● " + (await client.string(message.guild, "general.footer")));
                return message.channel.send(embed);
            }
        } catch (error) {
            let embed = new RichEmbed()
            .setTitle(client.config.title + " - " + await client.string(message.guild, "command.give.title"))
            .setDescription((await client.string(message.guild, "general.error")).replace("$error", "```Error logged in console.```"))
            .setColor(client.config.color)
            .setFooter(client.config.title + " ● " + (await client.string(message.guild, "general.footer")));
            message.channel.send(embed);
            return client.log.warn(error, "C_COINS");
        }
    } else {
        let embed = new RichEmbed()
            .setTitle(client.config.title + " - " + await client.string(message.guild, "command.give.title"))
            .setDescription((await client.string(message.guild, "command.give.error")).replace("$command", client.config.prefix + "givecoins" + await client.string(message.guild, "command.give.usage")))
            .setColor(client.config.color)
            .setFooter(client.config.title + " ● " + (await client.string(message.guild, "general.footer")).replace("$user", message.author.tag));
        message.channel.send(embed);
    }
};

module.exports.help = {
    name: "give",
    description: "command.give.description",
    usage: "command.give.usage"
};