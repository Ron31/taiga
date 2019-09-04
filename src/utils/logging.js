let chalk = require("chalk");
let df = require('dateformat');

module.exports = {
    info(message, module) {
        console.log(chalk.green("[" + df(new Date(), "dd.mm.yyyy HH:MM:ss") + "][INFO]" + "[" + module + "]") + ": " + message);
    },
    warn(message, module) {
        console.log(chalk.yellow("[" + df(new Date(), "dd.mm.yyyy HH:MM:ss") + "][WARNING]" + "[" + module + "]") + ": " + message);
    },
    error(message, module) {
        console.log(chalk.red("[" + df(new Date(), "dd.mm.yyyy HH:MM:ss") + "][ERROR]" + "[" + module + "]") + ": " + message);
    },
    fatal(message, module) {
        console.log(chalk.red("[" + df(new Date(), "dd.mm.yyyy HH:MM:ss") + "][FATAL]" + "[" + module + "]") + ": " + message);
    },
    debug(message, module) {
        console.log(chalk.blue("[" + df(new Date(), "dd.mm.yyyy HH:MM:ss") + "][DEBUG]" + "[" + module + "]") + ": " + message);
    },
}