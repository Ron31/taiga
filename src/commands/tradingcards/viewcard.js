const { RichEmbed, Attachment } = require("discord.js");
const { TradingCard, Inventory } = require("../../taiga");

module.exports.run = async (cmd, client, args, message) => {
    if(args.length == 1 && /^\d+$/.test(args[0])) {
        let userInventory = await Inventory.init(message.author);
        if(parseInt(args[0]) > userInventory.tradingCards.length || parseInt(args[0]) <= 0) {
            let embed = new RichEmbed()
            .setTitle(client.config.title + " - " + await client.string(message.guild, "command.viewcard.title"))
            .setDescription((await client.string(message.guild, "command.viewcard.cardNotFound.")).replace("$command", client.config.prefix + "cards"))
            .setColor(client.config.color)
            .setFooter(client.config.title + " ● " + (await client.string(message.guild, "general.footer")).replace("$user", message.author.tag));
            return message.channel.send(embed);
        }
        let attachment = await new Attachment(await userInventory.tradingCards[args[0] - 1].getImage(message.guild), "tc.png");
        message.channel.send(attachment);
    } else {
        let embed = new RichEmbed()
        .setTitle(client.config.title + " - " + await client.string(message.guild, "command.viewcard.title"))
        .setDescription((await client.string(message.guild, "general.syntax")).replace("$command", client.config.prefix + "viewcard" + await client.string(message.guild, "command.viewcard.usage")))
        .setColor(client.config.color)
        .setFooter(client.config.title + " ● " + (await client.string(message.guild, "general.footer")).replace("$user", message.author.tag));
        message.channel.send(embed);
    }
};

module.exports.help = {
    name: "viewcard",
    description: "command.viewcard.description",
    usage: "command.viewcard.usage",
    tctest: true
};