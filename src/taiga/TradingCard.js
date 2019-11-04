const { registerFont, createCanvas, loadImage } = require("canvas");
const database = require("../utils/database");
const Rarity = require("./Rarity");
const Rarities = require("./Rarities");
const Deck = require("./Deck");

function string(guild, string) {
    return new Promise(function(resolve, reject) {
        database.query("SELECT * FROM `guilds_settings` WHERE `guild` = ?", [guild.id], (err, results) => {
            if(!results[0]) {
                let lang = "en_us";
                database.query("INSERT INTO `guilds_settings`(`guild`, `language`, `music`) VALUES (?,?,?)", [guild.id, lang, false]);
                let langFile = require("../languages/" + lang + ".json");
                if(!langFile[string]) {
                    resolve("[String not found: " + string + "]");
                } else {
                    resolve(langFile[string]);
                }
            } else {
                let lang = results[0].language;
                let langFile = require("../languages/" + lang + ".json");
                if(langFile[string]) {
                    resolve(langFile[string]);
                } else {
                    lang = "en_us";
                    langFile = require("../languages/" + lang + ".json");
                    if(langFile[string]) {
                        resolve(langFile[string]);
                    } else {
                        resolve("[String not found: " + string + "]");
                    }
                }
            }
        });
    });
}

function printAtWordWrap( context , text, x, y, lineHeight, fitWidth) {
    fitWidth = fitWidth || 0;
    
    if (fitWidth <= 0) {
        context.fillText( text, x, y );
        return;
    }
    var words = text.split(' ');
    var currentLine = 0;
    var idx = 1;
    while (words.length > 0 && idx <= words.length) {
        var str = words.slice(0,idx).join(' ');
        var w = context.measureText(str).width;
        if ( w > fitWidth ) {
            if (idx==1) {
                idx=2;
            }
            context.fillText( words.slice(0,idx-1).join(' '), x, y + (lineHeight*currentLine) );
            currentLine++;
            words = words.splice(idx-1);
            idx = 1;
        }
        else {
            idx++;
        }
    }
    if (idx > 0) context.fillText( words.join(' '), x, y + (lineHeight*currentLine));
}

/**
 * A Trading Card
 */
class TradingCard {
    /**
     * Checks if a trading card with the specified id exists.
     * @param {?number} id The trading card ID
     * @returns {?boolean}
     * @static
     * @example
     * (TradingCard.validateId(1)) ? console.log("Trading card exists") : console.log("Trading card doesn't exist");
     */
    static validateId(id) {
        return new Promise((resolve, reject) => {
            database.query("SELECT * FROM tc_cards WHERE id = ? LIMIT 1", [id], async(error, results) => {
                if(!results.length == 0) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            });
        });
    }

    constructor(id, internalName, displayName, imageName, owners, maxOwners, description, rarity) {
        /**
         * The ID of the Trading Card
         * @type {?number}
         */
        this.id = id;

        /**
         * The internal name of the Trading Card
         * @type {?string}
         */
        this.internalName = internalName;

        /**
         * The display name of the Trading Card
         * @type {?string}
         */
        this.displayName = displayName;

        /**
         * The image name of the Trading Card
         * @type {?string}
         */
        this.imageName = imageName;

        /**
         * The owner amount of the Trading Card
         * @type {?number}
         */
        this.owners = owners;

        /**
         * The maximum owner amount of the Trading Card
         * @type {?number}
         */
        this.maxOwners = maxOwners;

        /**
         * The description of the Trading Card
         * @type {?string}
         */
        this.description = description;

        /**
         * The rarity of the trading card
         * @type {Rarity}
         */
        this.rarity = rarity;
    }

    /**
     * This creates a new Trading Card Instance 
     * @param {?number} id The trading card ID
     * @static
     */
    static async init(id) {
        return new Promise((resolve, reject) => {
            database.query("SELECT * FROM tc_cards WHERE id = ? LIMIT 1", [id], async(error, results) => {
                let id = (results.length != 0) ? results[0].id : 0;
                let internalName = (results.length != 0) ? results[0].internalName : "invalid";
                let displayName = (results.length != 0) ? results[0].displayName : "Invalid";
                let imageName = (results.length != 0) ? internalName + ".png" : "invalid.png";
                let owners = (results.length != 0) ? results[0].owners : 0;
                let maxOwners = (results.length != 0) ? results[0].maxOwners : 0;
                let description = (results.length != 0) ? results[0].description : "Invalid Trading Card";
                let rarity = await Rarity.init(0);
                if(await Rarity.validateId((results.length != 0) ? results[0].rarity : 0)) {
                    rarity = await Rarity.init(results[0].rarity);
                }
                resolve(new TradingCard(id, internalName, displayName, imageName, owners, maxOwners, description, rarity));
            });
        });
    }

    /**
     * This gives a random card, with chances in mind
     * @return {Promise<TradingCard>}
     * @static
     */
    static async randomCard(id) {
        return new Promise((resolve, reject) => {
            let rarities = new Rarities();
            database.query("SELECT * FROM tc_rarities", [], async(error, results) => {
                for(let i = 0; i < results.length; i++) {
                    rarities.add(await Rarity.init(results[i]["id"]));
                }
                let randomRarities = new Rarities();
                rarities.array().forEach((cRarity) => {
                    let amount = cRarity.chance.chance * 100;
                    console.log(amount);
                    for(let i = 0; i < amount; i++) {
                        randomRarities.add(cRarity);
                    }
                });
                let randomChance = randomRarities.array()[Math.floor(Math.random() * randomRarities.array().length)];
                resolve(randomChance);
            });
        });
    }

    /**
     * This returns the image of the trading card
     */
    async getImage(guild) {
        return new Promise(async (resolve, reject) => {
            registerFont("../fonts/Exo2-Black.ttf", { family: "Exo 2" } )
            let canvas = createCanvas(800, 1160);
            let ctx = canvas.getContext("2d");
            let cardImage = await loadImage("http://nossl.cdn.crugg.de/taiga/tradingcards/cards/" + this.imageName);
            let background = await loadImage("http://nossl.cdn.crugg.de/taiga/tradingcards/" + this.rarity.backgroundFile);
            ctx.drawImage(cardImage, 68, 156, 666, 631);
            ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
            ctx.font = "68px 'Exo 2'";
            ctx.fillStyle = "#FFFFFF";
            ctx.textAlign = "start";
            ctx.fillText(this.displayName.toUpperCase(), 75, 102);
            ctx.textAlign = "end";
            ctx.fillText((await string(guild, this.rarity.stringName)).toUpperCase(), 745, 853);
            ctx.font = "38px 'Exo 2'";
            ctx.textAlign = "start";
            printAtWordWrap(ctx, this.description, 74, 903, 40, 652)
            resolve(canvas.toBuffer());
        });
    }
}

module.exports = TradingCard;