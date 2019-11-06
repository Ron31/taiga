const { RichEmbed } = require("discord.js");
const { Inventory } = require("../../taiga");

module.exports.run = async (cmd, client, args, message) => {
    let tradingCards = (await Inventory.init(message.author)).tradingCards;
    let tradingCardNames = [];
    tradingCards.forEach(async (tc, i) => {
        tradingCardNames.push("`" + (i + 1) + "` - " + tc.displayName + " (" + await client.string(message.guild, tc.rarity.stringName) + ")" );
        if(i + 1 == tradingCards.length) {
            let embed = new RichEmbed()
            .setColor(client.config.color)
            .setTitle(client.config.title + " - " + await client.string(message.guild, "command.cards.title"))
            .setDescription((await client.string(message.guild, "command.cards.descriptionText")).replace("$command", "`" + client.config.prefix + "viewcard" + (await client.string(message.guild, "command.viewcard.usage")) + "`"))
            .addField(await client.string(message.guild, "command.cards.subtitle"), tradingCardNames.join("\n"))
            .setFooter(client.config.title + " ● " + (await client.string(message.guild, "general.footer")).replace("$user", message.author.tag));
            return message.channel.send(embed);
        }
    });
};

module.exports.help = {
    name: "cards",
    description: "command.cards.description",
    usage: "",
    tctest: true
};