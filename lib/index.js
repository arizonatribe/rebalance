const { exchangeHoldings, validateHoldings } = require("./helpers")

/**
 * A set of instructions on the movement of funds from accounts
 * 
 * @typedef {Object<string, string|number>} Exchange
 * @property {number} amount The amount being exchanged
 * @property {string} from The account from which the amount is being moved
 * @property {string} to The account to which the amount is being moved
 */

/**
 * An API which handles logic around account holdings rebalancing (transfers)
 *
 * @class
 * @name Rebalance
 */
class Rebalance {
    constructor(currentHoldings, desiredHoldings) {
        this.currentHoldings = currentHoldings
        this.desiredHoldings = desiredHoldings
    }
  
    /**
     * Rebalances the account current holdings to the desired holdings amounts.
     *
     * @function
     * @name Rebalance#solve
     * @returns {Array<Exhange>} The rebalanced account holdings
     */
    solve() {
        return exchangeHoldings(this.currentHoldings, this.desiredHoldings)
    }
  
    /**
     * Validates the current and desired account holdings.
     *
     * @function
     * @name Rebalance#validate
     * @throws {Error|TypeError} If there are validation errors due to missing or invalid holdings
     * @returns {boolean} If the holdings are valid
     */
    validate() {
        return validateHoldings(this.currentHoldings, this.desiredHoldings)
    }
  
    /**
     * Validates _and_ rebalances the account holdings.
     *
     * @function
     * @name Rebalance#solution
     * @returns {Array<Exhange>} The rebalanced account holdings
     */
    solution() {
        this.validate()
        return this.solve()
    }
}

module.exports = Rebalance
