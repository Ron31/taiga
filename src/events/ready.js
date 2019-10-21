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
    const app = express();

    app.use(bodyparser.json({type: "application/json"}));
    app.use(bodyparser.urlencoded({extended: true}));

    app.use("/api", require("../routes/api"));

    app.get("/", (req, res) => {
        res.redirect("https://taiga.js.org/webinterface")
    })

    let server = app.listen(7362, "127.0.0.1", async () => {
        client.log.info("Express App started...", "I_EXPRESS");
    });
};