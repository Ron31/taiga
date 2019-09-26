module.exports = async (client) => {
    client.log.info("The bot has sucessfully started", "E_READY");
    client.user.setStatus("online");
    let activities = [{type: "LISTENING", text: "to help"}, {type: "WATCHING", text: "Toradora!"}, {type: "WATCHING", text: "over $guilds Guilds"}, {type: "WATCHING", text: "over $users Users"}];
    setInterval(function() {
      let activity = activities[Math.floor(Math.random() * activities.length)];
      client.user.setActivity(activity.text.replace("$prefix", client.config.prefix).replace("$guilds", client.numbers.numberWithCommas(client.guilds.size)).replace("$users", client.numbers.numberWithCommas(client.users.size)), { type: activity.type});
    }, 12000);
};