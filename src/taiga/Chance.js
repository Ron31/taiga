/**
 * A chance for drops of trading cards. If the given value is higher than 100, it will be 100.
 */
class Chance {
    /**
     * @param {?number} value The chance value
     */
    constructor(value) {
        if(!value > 100) {
            this.chance = value;
        } else {
            this.chance = 100;
        }
    }
}