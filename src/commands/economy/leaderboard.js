const { RichEmbed } = require("discord.js");

module.exports.run = async (cmd, client, args, message) => {
    let emojis = [":one:", ":two:", ":three:", ":four:", ":five:", ":six:", ":seven:", ":eight:", ":nine:", ":keycap_ten:"];
    let topTen = await client.economy.getTopTen();
    let leaderboardString = "";
    for(i = 0; i < topTen.length; i++) {
        if(client.users.find(val => val.id == topTen[i].user)) {
            var user = client.users.find(val => val.id == topTen[i].user).tag;
        } else {
            var user = await client.string(message.guild, "command.leaderboard.unknown");
        }
        leaderboardString += emojis[i] + " " + user + " | 〒" + topTen[i].taigacoins + "\n";
    }
    let embed = new RichEmbed()
    .setTitle(client.config.title + " - " + await client.string(message.guild, "command.leaderboard.title"))
    .setDescription(leaderboardString)
    .setColor(client.config.color)
    .setFooter(client.config.title + " ● " + (await client.string(message.guild, "general.footer")).replace("$user", message.author.tag));
    message.channel.send(embed);
};

module.exports.help = {
    name: "leaderboard",
    description: "command.leaderboard.description",
    usage: "command.leaderboard.usage"
};