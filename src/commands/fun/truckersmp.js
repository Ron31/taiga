const { RichEmbed } = require("discord.js");
const { get } = require("axios");

module.exports.run = async (cmd, client, args, message) => {
    let versionResult = (await get("https://api.truckersmp.com/v2/version")).data;
    let serversResult = (await get("https://api.truckersmp.com/v2/servers")).data;
    let queueString = await client.string(message.guild, "command.truckersmp.queue");
    let etsArray = [];
    let atsArray = [];
    serversResult.response.forEach((server) => {
        let string = server.name + " " + server.players + "/" + server.maxplayers + " " + queueString.replace("$amount", server.queue);
        switch(server.game) {
            case("ETS2"): {
                etsArray.push(string);
            }
            case("ATS"): {
                atsArray.push(string);
            }
        }
    })
    let etsStatus = etsArray.join("\n");
    let atsStatus = atsArray.join("\n");
    let embed = new RichEmbed()
        .setTitle(client.config.title + " - " + await client.string(message.guild, "command.truckersmp.title"))
        .setColor(client.config.color)
        .setFooter(client.config.title + " ● " + (await client.string(message.guild, "general.footer")).replace("$user", message.author.tag))
        .addField((await client.string(message.guild, "command.truckersmp.serversHeading")).replace("$game", "Euro Truck Simulator 2"), etsStatus, true)
        .addField((await client.string(message.guild, "command.truckersmp.serversHeading")).replace("$game", "American Truck Simulator"), atsStatus, true)
        .addField(await client.string(message.guild, "command.truckersmp.versionHeading"), await client.string(message.guild, "command.truckersmp.truckersmpVersion") + ": "
        + versionResult.name + " (" + versionResult.stage + ")\n" + (await client.string(message.guild, "command.truckersmp.gameVersion")).replace("$game", "ETS2") + ": "
        + versionResult.supported_game_version + "\n" + (await client.string(message.guild, "command.truckersmp.gameVersion")).replace("$game", "ATS") + ": " + versionResult.supported_ats_game_version, false);
    message.channel.send(embed);
};

module.exports.help = {
    name: "truckersmp",
    description: "command.truckersmp.description",
    usage: ""
};