const { User } = require("discord.js");
const db = require("../utils/database");

/**
 * Class for Economy Utilities. This should only be used inside the TaigaClient Class.
 */
class EconomyUtility {
    constructor() {
        this.timeouts = new Set();
    }

    /**
     * Give coins to the specified user
     * @param {User} user The user which should get the coins
     * @param {?number} amount The amount of coins
     * @return {Promise<?boolean>}
     */
    addCoins(user, amount) {
        return new Promise(function(resolve, reject) {
            db.query("SELECT * FROM users_money WHERE user = ? LIMIT 1", [user.id], async(err, results) => {
                if(!results[0]) {
                    db.query("INSERT INTO `users_money`(`user`, `taigacoins`, `economyban`) VALUES (?,?,0)", [user.id, amount]);
                    resolve(true);
                } else {
                    let originalMoney = results[0]["taigacoins"];
                    db.query("UPDATE `users_money` SET `taigacoins` = ? WHERE `user` = ?", [originalMoney + amount, user.id]);
                    resolve(true);
                }
            });
        });
    }

    /**
     * Remove coins from the specified user
     * @param {User} user The user which should lose the coins
     * @param {?number} amount The amount of coins
     * @return {Promise<?boolean>}
     */
    removeCoins(user, amount) {
        return new Promise(function(resolve, reject) {
            db.query("SELECT * FROM users_money WHERE user = ? LIMIT 1", [user.id], async(err, results) => {
                if(!results[0]) {
                    db.query("INSERT INTO `users_money`(`user`, `taigacoins`, `economyban`) VALUES (?,?,0)", [user.id, -amount]);
                    resolve(true);
                } else {
                    let originalMoney = results[0]["taigacoins"];
                    db.query("UPDATE `users_money` SET `taigacoins` = ? WHERE `user` = ?", [originalMoney - amount, user.id]);
                    resolve(true);
                }
            });
        });
    }

    /**
     * Get coins of the specified user
     * @param {User} user The user with the coins you will get
     * @return {Promise<?number>}
     */
    getCoins(user) {
        return new Promise(function(resolve, reject) {
            db.query("SELECT * FROM users_money WHERE user = ? LIMIT 1", [user.id], async(err, results) => {
                if(!results[0]) {
                    db.query("INSERT INTO `users_money`(`user`, `taigacoins`, `economyban`) VALUES (?,0,0)", [user.id]);
                    resolve(0);
                } else {
                    resolve(parseInt(results[0]["taigacoins"]));
                }
            });
        });
    }

    /**
     * Get top ten users
     * @return {Promise<Object<*>>}
     */
    getTopTen() {
        return new Promise(function(resolve, reject) {
            db.query("SELECT * FROM users_money ORDER BY taigacoins DESC LIMIT 10", [], async(err, results) => {
                resolve(results);
            });
        });
    }

    /**
     * Give daily rewards to the specified User
     * @param {User} user The user which should recieve the daily reward
     * @return {Promise<?boolean>}
     */
    daily(user) {
        return new Promise((resolve, reject) => {
            db.query("SELECT * FROM users_cooldowns WHERE user = ? LIMIT 1", [user.id], async(err, results) => {
                if(!results[0]) {
                    let oldDate = new Date('2017-01-01T00:00:00');
                    let currentDate = new Date();
                    db.query("INSERT INTO `users_cooldowns`(user, hourlyLast, dailyLast, weeklyLast, monthlyLast) VALUES (?, ?, ?, ?, ?)", [user.id, oldDate, currentDate, oldDate, oldDate]);
                    this.addCoins(user, 100);
                    resolve(true);
                } else {
                    if((new Date() - results[0].dailyLast) >= 86400000) {
                        db.query("UPDATE users_cooldowns SET dailyLast = ? WHERE user = ?", [new Date(), user.id]);
                        this.addCoins(user, 100);
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                }
            });
        });
    }

    /**
     * Give weekly rewards to the specified User
     * @param {User} user The user which should recieve the weekly reward
     * @return {Promise<?boolean>}
     */
    weekly(user) {
        return new Promise((resolve, reject) => {
            db.query("SELECT * FROM users_cooldowns WHERE user = ? LIMIT 1", [user.id], async(err, results) => {
                if(!results[0]) {
                    let oldDate = new Date('2017-01-01T00:00:00');
                    let currentDate = new Date();
                    db.query("INSERT INTO `users_cooldowns`(user, hourlyLast, dailyLast, weeklyLast, monthlyLast) VALUES (?, ?, ?, ?, ?)", [user.id, oldDate, oldDate, currentDate, oldDate]);
                    this.addCoins(user, 250);
                    resolve(true);
                } else {
                    if((new Date() - results[0].weeklyLast) >= 604800000) {
                        db.query("UPDATE users_cooldowns SET weeklyLast = ? WHERE user = ?", [new Date(), user.id]);
                        this.addCoins(user, 250);
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                }
            });
        });
    }


    /**
     * Give monthly rewards to the specified User
     * @param {User} user The user which should recieve the monthly reward
     * @return {Promise<?boolean>}
     */
    monthly(user) {
        return new Promise((resolve, reject) => {
            db.query("SELECT * FROM users_cooldowns WHERE user = ? LIMIT 1", [user.id], async(err, results) => {
                if(!results[0]) {
                    let oldDate = new Date('2017-01-01T00:00:00');
                    let currentDate = new Date();
                    db.query("INSERT INTO `users_cooldowns`(user, hourlyLast, dailyLast, weeklyLast, monthlyLast) VALUES (?, ?, ?, ?, ?)", [user.id, oldDate, oldDate, oldDate, currentDate]);
                    this.addCoins(user, 750);
                    resolve(true);
                } else {
                    if((new Date() - results[0].monthlyLast) >= 2592000000) {
                        db.query("UPDATE users_cooldowns SET monthlyLast = ? WHERE user = ?", [new Date(), user.id]);
                        this.addCoins(user, 750);
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                }
            });
        });
    }

    /**
     * Set user in the timeout set
     * @param {User} user The user which should timeouted
     * @param {?number} length The length of the timeout in milliseconds
     */
    startTimeout(user, length) {
        this.timeouts.add(user.id);
        setTimeout(() => { this.timeouts.delete(user.id); }, length);
    }

    /**
     * Check if user is in the timeout set
     * @param {User} user The user which should be checked
     * @return {?boolean}
     */
    getTimeout(user) {
        return this.timeouts.has(user.id)
    }
}

module.exports = EconomyUtility;