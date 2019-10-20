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