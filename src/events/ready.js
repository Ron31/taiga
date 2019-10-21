module.exports = async (client) => {
    client.log.info("The bot has sucessfully started", "E_READY");
    client.user.setStatus("online");
    let activities = [{type: "LISTENING", text: "$prefixhelp"}, {type: "WATCHING", text: "Toradora!"}, {type: "WATCHING", text: "over $guilds Guilds"}, {type: "WATCHING", text: "over $users Users"}];
    setInterval(function() {
      let activity = activities[Math.floor(Math.random() * activities.length)];
      client.user.setActivity(activity.text.replace("$prefix", client.config.prefix).replace("$guilds", client.numbers.numberWithCommas(client.guilds.size)).replace("$users", client.numbers.numberWithCommas(client.users.size)), { type: activity.type});
    }, 12000);

    // Express
    const express = require("express");
    const bodyparser = require("body-parser");
    const cors = require('cors');
    const app = express();

    app.use(cors());
    app.use(bodyparser.json({type: "application/json"}));
    app.use(bodyparser.urlencoded({extended: true}));

    router.get("/", (req, res) => {
        res.json({ success: false, error: "You haven't specified an endpoint.", data: {}});
    });
    
    router.get("/getLeaderboard", async (req, res) => {
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
    let server = app.listen(process.env.API_PORT, process.env.API_IP, async () => {
        client.log.info("Express App started...", "I_EXPRESS");
    });
};