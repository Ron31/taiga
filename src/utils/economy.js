const database = require("./database");

module.exports.addCoins = function(user, amount) {
    return new Promise(function (resolve, reject) {
        database.query("SELECT * FROM users_money WHERE user = ? LIMIT 1", [user.id], async (err, results) => {
            if(!results[0]) {
                database.query("INSERT INTO `users_money`(`user`, `taigacoins`, `economyban`) VALUES (?,?,0)", [user.id, amount]);
                resolve(true);
            } else {
                let originalMoney = results[0]["taigacoins"];
                database.query("UPDATE `users_money` SET `taigacoins` = ? WHERE `user` = ?", [originalMoney + amount, user.id]);
                resolve(true);
            }
        });
    });
}

module.exports.removeCoins = function(user, amount) {
    return new Promise(function (resolve, reject) {
        database.query("SELECT * FROM users_money WHERE user = ? LIMIT 1", [user.id], async (err, results) => {
            if(!results[0]) {
                database.query("INSERT INTO `users_money`(`user`, `taigacoins`, `economyban`) VALUES (?,?,0)", [user.id, -amount]);
                resolve(true);
            } else {
                let originalMoney = results[0]["taigacoins"];
                database.query("UPDATE `users_money` SET `taigacoins` = ? WHERE `user` = ?", [originalMoney - amount, user.id]);
                resolve(true);
            }
        });
    });
}

module.exports.getCoins = function(user) {
    return new Promise(function (resolve, reject) {
        database.query("SELECT * FROM users_money WHERE user = ? LIMIT 1", [user.id], async (err, results) => {
            if(!results[0]) {
                database.query("INSERT INTO `users_money`(`user`, `taigacoins`, `economyban`) VALUES (?,0,0)", [user.id]);
                resolve(0);
            } else {
                resolve(parseInt(results[0]["taigacoins"]));
            }
        });
    });
}

module.exports.getTopTen = function() {
    return new Promise(function (resolve, reject) {
        database.query("SELECT * FROM users_money ORDER BY taigacoins DESC LIMIT 10", [], async (err, results) => {
            resolve(results);
        });
    });
}

module.exports.hourly = function(user) {
    return new Promise((resolve, reject) => {
        database.query("SELECT * FROM users_cooldowns WHERE user = ? LIMIT 1", [user.id], async (err, results) => {
            if(!results[0]) {
                let oldDate = new Date('2017-01-01T00:00:00');
                let currentDate = new Date();
                database.query("INSERT INTO `users_cooldowns`(user, hourlyLast, dailyLast, weeklyLast, monthlyLast) VALUES (?, ?, ?, ?)", [user.id, currentDate, oldDate, oldDate, oldDate]);
                this.addCoins(user, 100);
                resolve(true);
            } else {
                if((new Date() - results[0].hourlyLast) >= 3600000) {
                    database.query("UPDATE users_cooldowns SET hourlyLast = ? WHERE user = ?", [new Date(), user.id]);
                    this.addCoins(user, 100);
                    resolve(true);
                } else {
                    resolve(false);
                }
            }
        });
    });
}

module.exports.daily = function(user) {
    return new Promise((resolve, reject) => {
        database.query("SELECT * FROM users_cooldowns WHERE user = ? LIMIT 1", [user.id], async (err, results) => {
            if(!results[0]) {
                let oldDate = new Date('2017-01-01T00:00:00');
                let currentDate = new Date();
                database.query("INSERT INTO `users_cooldowns`(user, hourlyLast, dailyLast, weeklyLast, monthlyLast) VALUES (?, ?, ?, ?)", [user.id, oldDate, currentDate, oldDate, oldDate]);
                this.addCoins(user, 250);
                resolve(true);
            } else {
                if((new Date() - results[0].dailyLast) >= 86400000) {
                    database.query("UPDATE users_cooldowns SET dailyLast = ? WHERE user = ?", [new Date(), user.id]);
                    this.addCoins(user, 250);
                    resolve(true);
                } else {
                    resolve(false);
                }
            }
        });
    });
}

module.exports.weekly = function(user) {
    return new Promise((resolve, reject) => {
        database.query("SELECT * FROM users_cooldowns WHERE user = ? LIMIT 1", [user.id], async (err, results) => {
            if(!results[0]) {
                let oldDate = new Date('2017-01-01T00:00:00');
                let currentDate = new Date();
                database.query("INSERT INTO `users_cooldowns`(user, hourlyLast, dailyLast, weeklyLast, monthlyLast) VALUES (?, ?, ?, ?)", [user.id, oldDate, oldDate, currentDate, oldDate]);
                this.addCoins(user, 500);
                resolve(true);
            } else {
                if((new Date() - results[0].weeklyLast) >= 604800000) {
                    database.query("UPDATE users_cooldowns SET weeklyLast = ? WHERE user = ?", [new Date(), user.id]);
                    this.addCoins(user, 500);
                    resolve(true);
                } else {
                    resolve(false);
                }
            }
        });
    });
}

module.exports.monthly = function(user) {
    return new Promise((resolve, reject) => {
        database.query("SELECT * FROM users_cooldowns WHERE user = ? LIMIT 1", [user.id], async (err, results) => {
            if(!results[0]) {
                let oldDate = new Date('2017-01-01T00:00:00');
                let currentDate = new Date();
                database.query("INSERT INTO `users_cooldowns`(user, hourlyLast, dailyLast, weeklyLast, monthlyLast) VALUES (?, ?, ?, ?)", [user.id, oldDate, oldDate, oldDate, currentDate]);
                this.addCoins(user, 500);
                resolve(true);
            } else {
                if((new Date() - results[0].monthlyLast) >= 2592000000) {
                    database.query("UPDATE users_cooldowns SET monthlyLast = ? WHERE user = ?", [new Date(), user.id]);
                    this.addCoins(user, 1000);
                    resolve(true);
                } else {
                    resolve(false);
                }
            }
        });
    });
}