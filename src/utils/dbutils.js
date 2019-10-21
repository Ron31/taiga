const database = require("./database");

module.exports.validateToken = function(token) {
    return new Promise(function (resolve, reject) {
        database.query("SELECT * FROM cp_tokens WHERE token = ? LIMIT 1", [token], async (error, tokenRequest) => {
            if(!tokenRequest[0]) {
                resolve(false);
            } else {
                resolve(true);
            }
        });
    });
}