# taiga
This is a multi-functional Discord Bot based on the character Taiga Aisaka (逢坂 大河) from the anime "Toradora!"

## Features
* Basic Economy
* Random Image Commands

## Todo / Planned
* Advanced Economy Features
* Image Profile Card
* Music
* Moderation
* Other useful stuff
* Webinterface (maybe)

## Contribution Guidelines
### Gitmoji
Always add an Emoji from [gitmoji](https://gitmoji.carloscuesta.me/), whose description fits your commit the best, in front of your commit message.

### Language
Instead of hardcoding any output, add it to the [`en_us.json`](https://github.com/taigadiscord/taiga/blob/master/src/languages/en_us.json) and maybe for other languages you speak (if your language doesn't exist, contact me) and then use the following code to get the string.
When adding a string for a command, always name it `command.<Command>.<String>`. Also, console outputs can't be translated.
A better string system is planned.

#### Example
**en_us.json**
```json
{
    "command.example.test1": "Test 1",
    "command.example.test2": "Test 2",
    "command.example.description": "An example command",
    "command.example.usage": " <Arg1> [Arg2]"
}
```

**example.js**
````js
module.exports.run = async (cmd, client, args, message) => {
    client.string(message.guild, "command.example.test1", (myFirstString) => {
        client.string(message.guild, "command.example.test2", (mySecondString) => {
            if(args.length == 1) {
                message.channel.send(myFirstString);
            } else if(args.length == 2) {
                message.channel.send(mySecondString);
            }
        });
    });
};

module.exports.help = {
    name: "example",
    description: "command.example.description",
    usage: "command.example.usage"
}
```
