const { RichEmbed } = require("discord.js");

module.exports.run = async (cmd, client, args, message) => {
    /*
    if(args.length == 0) {
        displayError(1);
    } else if(args.length == 1) {
        displayError(1);
    } else {
        displayError(2);
    }
    */
    let prefix = client.config.prefix;
    let embed = new RichEmbed()
        .setTitle(client.config.title + " - " + await client.string(message.guild, "command.help.title"))
        .addField(":gear: Core", "`" + prefix + "help`, `" + prefix + "language`, `" + prefix + "about`")
        .addField(":mountain: Images", "`" + prefix + "taiga`, `" + prefix + "fox`, `" + prefix + "neko`")
        .addField(":moneybag: Economy", "`" + prefix + "coins`, `" + prefix + "givecoins`, `" + prefix + "leaderboard`")
        .addField(":tada: Fun", "`" + prefix + "anime`")
        .setColor(client.config.color)
        .setFooter(client.config.title + " ● " + (await client.string(message.guild, "general.footer")).replace("$user", message.author.tag));
    message.channel.send(embed);

    async function displayCategories() {
        let embed = new RichEmbed()
            .setTitle(client.config.title + " - " + await client.string(message.guild, "command.language.title") + " :globe_with_meridians:")
            .setDescription(await client.string(message.guild, "command.language.name"))
            .setColor(client.config.color)
            .setFooter(client.config.title + " ● " + (await client.string(message.guild, "general.footer")).replace("$user", message.author.tag));
        message.channel.send(embed);
    }
    async function displayError(error) {
        let embed = new RichEmbed()
            .setTitle(client.config.title + " - " + await client.string(message.guild, "command.help.title"))
            .setColor(client.config.color)
            .setFooter(client.config.title + " ● " + (await client.string(message.guild, "general.footer")).replace("$user", message.author.tag));
        if(error == 1) {
            embed.setDescription((await client.string(message.guild, "command.help.error1")).replace("$prefix", client.config.prefix));
        } else if(error == 2) {
            embed.setDescription((await client.string(message.guild, "command.help.error2")).replace("$prefix", client.config.prefix));
        }
        message.channel.send(embed);
    }
};

module.exports.help = {
    name: "help",
    description: "command.help.description",
    usage: "command.help.usage"
}