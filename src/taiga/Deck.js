const TradingCard = require("./TradingCard");

/**
 * A Deck of trading cards
 */
class Deck {
    constructor() {
        /**
         * The array of trading cards
         * @type {Array<TradingCard>}
         * @private
         */
        this._tradingCards = [];
    }

    /**
     * This adds a trading card to the deck
     * @param {TradingCard} card The card which should be added to the deck
     */
    add(card) {
        this._tradingCards.push(card);
    }

    /**
     * This returns the deck as an array
     * @return {Array<TradingCard>}
     */
    array() {
        return this._tradingCards;
    }
}

module.exports = Deck;