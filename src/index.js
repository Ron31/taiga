const { Client}  = require("discord.js");
const client = new Client({disableEveryone: true});
client.numbers = require("./utils/numbers");
client.log = require("./utils/logging");

const fs = require("fs");

require('dotenv').config();

let cmdDir = fs.readdirSync("./commands/");
for(let dir of cmdDir) {
    client.groups.push(dir);
    client.log.info("Loading command category " + dir + "...", "COMMANDHANDLER");
    let group = fs.readdirSync(`./commands/${dir}`);
    for (let commandFile of group) {
      client.log.info("Loading command " + dir + "/" + commandFile.split(".")[0] + ".", "COMMANDHANDLER");
      if (!commandFile.endsWith(".js")) {
        return;
      }
      let command = require(`./commands/${dir}/${commandFile}`);
      client.commands.set(commandFile.split(".")[0], command);
    }
}
fs.readdir("./events", (err, files) => {
    if (err) {
        client.log.fatal("Error occured whilst loading events: " + err, "EVENTHANDLER");
    }
    files.forEach((file) => {
        if (!file.endsWith(".js")) return;
        client.log.info("Loading event " + file.split(".")[0] + "...", "EVENTHANDLER");
        const event = require(`./events/${file}`);
        let eventName = file.split(".")[0];
        client.on(eventName, event.bind(null, client));
    });
});

client.login(process.env.BOT_TOKEN);