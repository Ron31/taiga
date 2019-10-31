const fs = require("fs");

module.exports = async(client, message) => {

    if (message.author.bot) return;
    if (message.channel.type === "dm") return;
    if (!client.economy.getTimeout(message.author)) {
        let money = Math.random() * (2 - 1) + 1;
        client.economy.addCoins(message.author, money);
        client.economy.startTimeout(message.author, 20000);
    }

    let prefix = client.config.prefix;
    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
    let args = messageArray.slice(1);
    let author = message.author;
    let guild = message.guild;
    if (!message.content.startsWith(prefix)) return;

    let commandFile = client.commands.get(cmd.slice(prefix.length));
    if (commandFile) {
        commandFile.run(cmd, client, args, message);
    }
};