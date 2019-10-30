module.exports = async (client) => {
    client.log.info("The bot has sucessfully started", "E_READY");
    client.user.setStatus("online");
    let activities = [{type: "LISTENING", text: "$prefixhelp"}, {type: "WATCHING", text: "Toradora!"}, {type: "WATCHING", text: "over $guilds Guilds"}, {type: "WATCHING", text: "over $users Users"}];
    setInterval(function() {
      let activity = activities[Math.floor(Math.random() * activities.length)];
      client.user.setActivity(activity.text.replace("$prefix", client.config.prefix).replace("$guilds", client.numberWithCommas(client.guilds.size)).replace("$users", client.numberWithCommas(client.users.size)), { type: activity.type});
    }, 12000);

    // Express
    const express = require("express");
    const bodyparser = require("body-parser");
    const cors = require('cors');
    const app = express();

    app.use(cors());
    app.use(bodyparser.json({type: "application/json"}));
    app.use(bodyparser.urlencoded({extended: true}));

    app.get("/", (req, res) => {
        res.json({ success: false, error: "You haven't specified an endpoint.", data: {}});
    });
    
    app.get("/getLeaderboard", async (req, res) => {
        let topTen = await client.economy.getTopTen()
        let leaderboard = [];
        for(i = 0; i < topTen.length; i++) {
            let userObject = {};
            if(client.users.find(val => val.id == topTen[i].user)) {
                let user = client.users.find(val => val.id == topTen[i].user); var username = user.username; var discriminator = user.discriminator; var avatar = user.avatarURL; var status = user.presence.status;
            } else {
                var username = "Unknown"; var discriminator = "0000"; var avatar = "https://api.adorable.io/avatars/285/" + topTen[i].user + ".png"; var status = "offline";
            }
            let object = { rank: i + 1, money: topTen[i].taigacoins, user: {id: topTen[i].id, username: username, discriminator: discriminator, avatar: avatar, status: status}};
            leaderboard.push(object);
        }
        res.json({
            success: true,
            error: "",
            data: {
                leaderboard: leaderboard
            }
        });
    });
    app.get("/getCommands", async (req, res) => {
        res.json({
            success: false,
            error: "Endpoint in development. Not functional yet.",
            data: {}
        })
    });
    app.get("/getLanguages", async (req, res) => {
        let langs = require("../utils/lang").languages;
        let langArray = [];
        let expLangs = require("../utils/lang").experimentalLanguages;
        let expLangArray = [];
        let originalStrings = Object.keys(require("../languages/en_us.json")).length;
        langs.forEach((lang) => {
            let name = require("../languages/" + lang + ".json")["command.language.name"];
            let nameArray = name.split(" ");
            nameArray.splice(0, 1);
            langArray.push({
                default: (lang == "en_us") ? true : false,
                code: lang,
                name: nameArray.join(" "),
                emoji: name.split(" ")[0],
                nameWithEmoji: name,
                amountFormatted: Math.round((Object.keys(require("../languages/" + lang + ".json")).length / originalStrings) * 100) + "%",
                amount: (Object.keys(require("../languages/" + lang + ".json")).length / originalStrings) * 100
            });
        });
        expLangs.forEach((lang) => {
            let name = require("../languages/" + lang + ".json")["command.language.name"];
            let nameArray = name.split(" ");
            nameArray.splice(0, 1);
            expLangArray.push({
                default: (lang == "en_us") ? true : false,
                code: lang,
                name: nameArray.join(" "),
                emoji: name.split(" ")[0],
                nameWithEmoji: name,
                amountFormatted: Math.round(( Object.keys(require("../languages/" + lang + ".json")).length / originalStrings) * 100) + "%",
                amount: (Object.keys(require("../languages/" + lang + ".json")).length / originalStrings) * 100
            });
        });
        res.json({
            success: true,
            error: "",
            data: { languages: langArray, experimentalLanguages: expLangArray }
        });
    });
    app.get("/getStaff", async (req, res) => {
        let ownerGuild = client.guilds.find(val => val.id == client.config.ownerGuild);
        let members = ownerGuild.members;
        let staffAray = [];
        members.forEach((member) => {
            let memberRoles = [];
            member.roles.forEach((role) => {
                if(client.config.staffRoles.includes(role.id)) {
                    memberRoles.push(role);
                }
            });
            if(memberRoles.length == 0) return;
            let currentRole;
            let currentPriority = 0;
            let rolesArray = [];
            memberRoles.forEach((role) => {
                rolesArray.push({
                    id: role.id,
                    priority: role.position,
                    color: role.color,
                    hexColor: role.hexColor,
                    name: role.name
                });
                if(role.position > currentPriority) {
                    currentRole = role;
                    currentPriority = role.position;
                }
            });
            staffAray.push({
                id: member.user.id,
                username: member.user.username,
                nickname: (member.nickname == null) ? member.user.username : member.nickname,
                discriminator: member.user.discriminator,
                avatar: member.user.avatarURL,
                status: member.user.presence.status,
                mainRole: {
                    id: currentRole.id,
                    priority: currentRole.position,
                    color: currentRole.color,
                    hexColor: currentRole.hexColor,
                    name: currentRole.name
                },
                allRoles: rolesArray
            });
        });
        res.json({
            success: true,
            error: "",
            data: { staff: staffAray }
        });
    });
    let server = app.listen(process.env.API_PORT, process.env.API_IP, async () => {
        client.log.info("Express App started...", "I_EXPRESS");
    });
};