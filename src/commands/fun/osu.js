const { RichEmbed } = require("discord.js");
const axios = require("axios");

module.exports.run = async (cmd, client, args, message) => {
    if(args.length == 1) {
        let user = args[0];
        var rawResult = await axios.get("https://osu.ppy.sh/api/get_user?k=" + process.env.OSU_TOKEN + "&u=" + user + "&type=string");
        if(rawResult.data[0]) {
            var result = rawResult.data[0];
        } else {
            let embed = new RichEmbed()
            .setTitle(client.config.title + " - " + await client.string(message.guild, "command.osu.title"))
            .setDescription(await client.string(message.guild, "command.osu.playerNotFound"))
            .setColor(client.config.color)
            .setFooter(client.config.title + " ● " + await client.string(message.guild, "command.osu.footer") + " ● " + (await client.string(message.guild, "general.footer")).replace("$user", message.author.tag));
            return message.channel.send(embed);
        }
        let embed = new RichEmbed()
        .setTitle(client.config.title + " - " + await client.string(message.guild, "command.osu.title") + ": " + result.username)
        .setURL("https://osu.ppy.sh/users/" + result.user_id)
        .addField(await client.string(message.guild, "command.osu.pp"), Math.round(parseInt(result.pp_raw)), true)
        .addField(await client.string(message.guild, "command.osu.accuracy"), Math.round(parseInt(result.accuracy)), true)
        .addField(await client.string(message.guild, "command.osu.rankGlobal"), result.pp_rank, true)
        .addField(await client.string(message.guild, "command.osu.rankLocal") + " (:flag_" + result.country.toLowerCase() + ":)", result.pp_country_rank, true)
        .addField(await client.string(message.guild, "command.osu.level"), Math.round(parseInt(result.level)), true)
        .addField(await client.string(message.guild, "command.osu.totalScore"), Math.round(parseInt(result.total_score)), true)
        .addField(await client.string(message.guild, "command.osu.playcount"), result.playcount, true)
        .addField(await client.string(message.guild, "command.osu.joinDate"), result.join_date, true)
        .setColor(client.config.color)
        .setFooter(client.config.title + " ● " + await client.string(message.guild, "command.osu.footer") + " ● " + (await client.string(message.guild, "general.footer")).replace("$user", message.author.tag));
        message.channel.send(embed);
    } else {
        let embed = new RichEmbed()
        .setTitle(client.config.title + " - " + await client.string(message.guild, "command.osu.title"))
        .setDescription((await client.string(message.guild, "general.syntax")).replace("$command", client.config.prefix + "osu" + await client.string(message.guild, "command.osu.usage")))
        .setColor(client.config.color)
        .setFooter(client.config.title + " ● " + await client.string(message.guild, "command.osu.footer") + " ● " + (await client.string(message.guild, "general.footer")).replace("$user", message.author.tag));
        message.channel.send(embed);
    }
};

module.exports.help = {
    name: "osu",
    description: "command.osu.description",
    usage: "command.osu.usage"
};