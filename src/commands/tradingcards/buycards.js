const { RichEmbed, WebhookClient } = require("discord.js");
const { Inventory, TradingCard } = require("../../taiga");

module.exports.run = async (cmd, client, args, message) => {
    let price = 299;
    let embed = new RichEmbed()
    .setColor(client.config.color)
    .setTitle(client.config.title + " - " + await client.string(message.guild, "command.buycards.title"))
    .setDescription((await client.string(message.guild, "command.buycards.confirmation")).replace("$amount", "3").replace("$price", "〒" + price).replace("$emoji", "✅"))
    .setFooter(client.config.title + " ● " + (await client.string(message.guild, "general.footer")).replace("$user", message.author.tag));
    let reply = await message.channel.send(embed);
    let reaction = await reply.react("✅");
    let collector = reply.createReactionCollector((reaction, user) => reaction.emoji.name === "✅" && user.id == message.author.id, { time: 60000 });
    collector.on("collect", async (r) => {
        let inventory = await Inventory.init(message.author);
        reply.delete();
        reaction.remove();
        clearTimeout(timeout);
        // client.economy.removeCoins(message.author, price);
        let randomCards = [await TradingCard.randomCard(), await TradingCard.randomCard(), await TradingCard.randomCard()];
        let openingEmbed = new RichEmbed()
        .setColor(client.config.color)
        .setTitle(client.config.title + " - " + await client.string(message.guild, "command.buycards.title"))
        .setDescription((await client.string(message.guild, "command.buycards.opening")).replace("$number", await client.string(message.guild, "command.buycards.first")).replace("$seconds", 5))
        .setFooter(client.config.title + " ● " + (await client.string(message.guild, "general.footer")).replace("$user", message.author.tag));
        let message1 = await message.channel.send(openingEmbed);
        setTimeout(async () => {
            let cardEmbed1 = new RichEmbed()
            .setColor(client.config.color)
            .setTitle(client.config.title + " - " + await client.string(message.guild, "command.buycards.title"))
            .setImage("http://crugg.de:7362/tradingcards/" + randomCards[0].id + "/card.png")
            .setFooter(client.config.title + " ● " + (await client.string(message.guild, "general.footer")).replace("$user", message.author.tag));
            message1.edit(cardEmbed1);
            await inventory.add(randomCards[0]);


            let message2 = await message.channel.send(openingEmbed);
            setTimeout(async () => {
                let cardEmbed2 = new RichEmbed()
                .setColor(client.config.color)
                .setTitle(client.config.title + " - " + await client.string(message.guild, "command.buycards.title"))
                .setImage("http://crugg.de:7362/tradingcards/" + randomCards[1].id + "/card.png")
                .setFooter(client.config.title + " ● " + (await client.string(message.guild, "general.footer")).replace("$user", message.author.tag));
                message2.edit(cardEmbed2);
                await inventory.add(randomCards[1]);

                let message3 = await message.channel.send(openingEmbed);
                setTimeout(async () => {
                    let cardEmbed3 = new RichEmbed()
                    .setColor(client.config.color)
                    .setTitle(client.config.title + " - " + await client.string(message.guild, "command.buycards.title"))
                    .setImage("http://crugg.de:7362/tradingcards/" + randomCards[2].id + "/card.png")
                    .setFooter(client.config.title + " ● " + (await client.string(message.guild, "general.footer")).replace("$user", message.author.tag));
                    message3.edit(cardEmbed3);
                    await inventory.add(randomCards[2]);
                }, 5000);
            }, 5000);
        }, 5000);
    });
    let timeout = setTimeout(() => {
        if(reply) {
            reply.delete();
        }
        message.delete();
    }, 60000)
};

module.exports.help = {
    name: "buycards",
    description: "command.buycards.description",
    usage: "",
    tctest: true
};