const router = require("express").Router();
const { client } = require("../index");

router.get("/", (req, res) => {
    res.json({
        success: false,
        error: "You haven't specified an endpoint.",
        data: {

        }
    })
});

router.get("/getLeaderboard", async (req, res) => {
    let topTen = await client.economy.getTopTen()
    let leaderboard = [];
    for(i = 0; i < topTen.length; i++) {
        let object = {}
        let userObject = {};
        if(client.users.find(val => val.id == topTen[i].user)) {
            let user = client.users.find(val => val.id == topTen[i].user);
            var username = user.username;
            var discriminator = user.discriminator;
            var avatar = user.avatarURL;
            var status = user.presence.status;
        } else {
            var username = "Unknown";
            var discriminator = "0000";
            var avatar = "https://api.adorable.io/avatars/285/" + topTen[i].user + ".png";
            var status = "offline";
        }
        userObject.id = topTen[i].id;
        userObject.username = username;
        userObject.discriminator = discriminator;
        userObject.avatar = avatar;
        userObject.status = status;
        object.rank = i + 1;
        object.money = topTen[i].taigacoins;
        object.user = userObject;
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

module.exports = router;