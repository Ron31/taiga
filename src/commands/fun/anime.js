const { RichEmbed } = require("discord.js");
const axios = require("axios");

module.exports.run = async (cmd, client, args, message) => {
    if(args.length == 0) {
        let embed = new RichEmbed()
        .setTitle(client.config.title + " - " + await client.string(message.guild, "command.anime.title"))
        .setDescription((await client.string(message.guild, "general.syntax")).replace("$command", client.config.prefix + "anime" + await client.string(message.guild, "command.anime.usage")))
        .setColor(client.config.color)
        .setFooter(client.config.title + " ● " + await client.string(message.guild, "command.anime.footer") + " ● " + (await client.string(message.guild, "general.footer")).replace("$user", message.author.tag));
        message.channel.send(embed);
    } else {
        let search = encodeURIComponent(args.join(" "));
        let searchResult = (await axios.get("https://api.jikan.moe/v3/search/anime?q=" + search + "&limit=1")).data;
        let animeResult = (await axios.get("https://api.jikan.moe/v3/anime/" + searchResult.results[0].mal_id)).data;
        let genresArray = [];
        animeResult.genres.forEach((genre) => {
            genresArray.push("[" + genre.name + "](" + genre.url + ")");
        })
        let genres = genresArray.join(", ");
        let premiered = "Unknown";
        if(animeResult.premiered && animeResult.premiered != null) {
            premiered = animeResult.premiered;
        }
        let embed = new RichEmbed()
        .setTitle(client.config.title + " - " + await client.string(message.guild, "command.anime.title") + ": " + animeResult.title)
        .setURL(animeResult.url)
        .setThumbnail(animeResult.image_url)
        .addField(await client.string(message.guild, "command.anime.type"), animeResult.type, true)
        .addField(await client.string(message.guild, "command.anime.source"), animeResult.source, true)
        .addField(await client.string(message.guild, "command.anime.episodes"), animeResult.episodes, true)
        .addField(await client.string(message.guild, "command.anime.status"), animeResult.status, true)
        .addField(await client.string(message.guild, "command.anime.score"), ":star:" + animeResult.score, true)
        .addField(await client.string(message.guild, "command.anime.premiered"), premiered, true)
        .addField(await client.string(message.guild, "command.anime.genres"), genres, false)
        .setColor(client.config.color)
        .setFooter(client.config.title + " ● " + await client.string(message.guild, "command.anime.footer") + " ● " + (await client.string(message.guild, "general.footer")).replace("$user", message.author.tag));
        message.channel.send(embed);
    }
};

module.exports.help = {
    name: "anime",
    description: "command.anime.description",
    usage: "command.anime.usage"
};