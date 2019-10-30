const database = require("./database");

module.exports.TradingCard = class {
    static validateId(id) {
        return new Promise((resolve, reject) => {
            database.query("SELECT * FROM tc_cards WHERE id = ? LIMIT 1", [id], async (error, results) => {
                if(!results.length == 0) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            });
        });
    }
    constructor(id) {
        database.query("SELECT * FROM tc_cards WHERE id = ? LIMIT 1", [id], async (error, results) => {
            if(results.length == 0) {

            } else {
                this.id = id;
                this.internalName = results[0].internalName;
                this.displayName = results[0].displayName;
                this.imageName = this.internalName + ".png";
                this.owners = results[0].owners;
                this.maxOwners = results[0].maxOwners;
                this.description = results[0].description;
                this.stringName = "tradingcards.rarity." + this.internalName;
                if(await Rarity.validateId(results[0].rarity)) {
                    this.rarity = new Rarity(results[0].rarity);
                } else {
                    this.rarity = new Rarity(0);
                }
            }
        });
    }
}

module.exports.Rarity = class {
    static validateId(id) {
        return new Promise((resolve, reject) => {
            database.query("SELECT * FROM tc_rarities WHERE id = ? LIMIT 1", [id], async (error, results) => {
                if(!results.length == 0) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            });
        });
    }
    constructor(id) {
        database.query("SELECT * FROM tc_cards WHERE id = ? LIMIT 1", [id], async (error, results) => {
            if(results.length == 0) {

            } else {
                this.id = id;
                this.internalName = results[0].internalName;
                this.displayName = results[0].displayName;
                this.imageName = this.internalName + ".png";
                this.owners = results[0].owners;
                this.maxOwners = results[0].maxOwners;
                this.description = results[0].description;
                this.rarity = 
            }
        });
    }
}