const { RichEmbed } = require("discord.js");

module.exports.run = async (cmd, client, args, message) => {
    if(args.length == 1) {
        try {
            if(message.mentions.members.size == 1) {
                var user = message.mentions.members.first().user;
            } else {
                if(message.guild.members.find(val => val.user.username == args[0])) {
                    var user = message.guild.members.find(val => val.user.username == args[0]).user;
                } else {
                    let embed = new RichEmbed()
                    .setTitle(client.config.title + " - " + await client.string(message.guild, "command.coins.title"))
                    .setDescription((await client.string(message.guild, "general.userNotFound")))
                    .setColor(client.config.color)
                    .setFooter(client.config.title + " ● " + (await client.string(message.guild, "general.footer")));
                    return message.channel.send(embed);
                }
            }
            let coins = await client.economy.getCoins(user);
            let embed = new RichEmbed()
            .setTitle(client.config.title + " - " + await client.string(message.guild, "command.coins.title"))
            .setDescription((await client.string(message.guild, "command.coins.amountOther")).replace("$coins", coins).replace("$user", user.tag))
            .setColor(client.config.color)
            .setFooter(client.config.title + " ● " + (await client.string(message.guild, "general.footer")).replace("$user", message.author.tag));
            message.channel.send(embed);
        } catch (error) {
            let embed = new RichEmbed()
            .setTitle(client.config.title + " - " + await client.string(message.guild, "command.coins.title"))
            .setDescription((await client.string(message.guild, "general.error")).replace("$error", "```Error logged in console.```"))
            .setColor(client.config.color)
            .setFooter(client.config.title + " ● " + (await client.string(message.guild, "general.footer")));
            message.channel.send(embed);
            client.log.warn(error, "C_COINS");
        }
    } else {
        let coins = await client.economy.getCoins(message.author);
        let embed = new RichEmbed()
        .setTitle(client.config.title + " - " + await client.string(message.guild, "command.coins.title"))
        .setDescription((await client.string(message.guild, "command.coins.amount")).replace("$coins", coins))
        .setColor(client.config.color)
        .setFooter(client.config.title + " ● " + (await client.string(message.guild, "general.footer")).replace("$user", message.author.tag));
        message.channel.send(embed);
    }
};

module.exports.help = {
    name: "coins",
    description: "command.coins.description",
    usage: "command.coins.usage"
};