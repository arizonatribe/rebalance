/**
 * Checks if a given value is an object.
 *
 * @function
 * @name isObject
 * @param {*} val The value to be validated
 * @returns {boolean} Whether or not the value is an object
 */
function isObject(val) {
    return typeof val === "object" && val.constructor.name === "Object"
}

/**
 * Checks if a given object is empty of key/val pairs.
 *
 * @function
 * @name isEmpty
 * @param {*} val The object to be validated
 * @returns {boolean} Whether or not the object is empty of key/val pairs
 */
function isEmpty(val) {
    return Object.keys(val || {}).length === 0
}

/**
 * Checks if a given object is valid as a set of account holdings amounts.
 * Essentially should be an object whose values are positive numbers
 *
 * @function
 * @name areHoldingsEqual
 * @param {*} val The object to be validated
 * @returns {boolean} Whether or not the object works out as a set of account holdings
 */
function isValidHoldings(val) {
    return Object.entries(val || {}).every(([key, val]) => (
        typeof val === "number"
        && Number.isFinite(val)
        && val >= 0
    ))
}

/**
 * Checks if two sets of account holdings combine for the same total value.
 *
 * @function
 * @name areHoldingsEqual
 * @param {Objects<string, number>} holdingsA The first set of account holdings amounts
 * @param {Objects<string, number>} holdingsB The second set of account holdings amounts
 * @returns {boolean} Whether or not the account holdings totals are equal
 */
function areHoldingsEqual(holdingsA, holdingsB) {
    return (
        Object.values(holdingsA).reduce((acc, val) => acc + val, 0)
        === Object.values(holdingsB).reduce((acc, val) => acc + val, 0)
    )
}

/**
 * Represents an Exchange as a single (easily sortable) string
 *
 * @function
 * @name toExchangeString
 * @param {Exchange} exchange An Exchange to stringify
 * @returns {string} The sorted Exchange
 */
function toExchangeString(exchange) {
    return [exchange.from, exchange.to, exchange.amount]
        .filter(ex => ex != null)
        .join("-")
}

/**
 * Ensures that lists of exchange amounts occurs in alphabetic and numeric amount
 *
 * @function
 * @name sortExchanges
 * @param {Array<Exchange>} exchanges The unsorted exchanges
 * @returns {Array<Exchange>} The sorted list of exchange amounts
 */
function sortExchanges(exchanges) {
    return exchanges.sort((a, b) => (
        toExchangeString(a).localeCompare(toExchangeString(b))
    ))
}

/**
 * Validates a set of current and desired holdings amounts.
 *
 * @function
 * @name validateHoldings
 * @throws {Error} When the current or desired holdings are missing
 * @throws {Error} When the current and desired holdings totaled amounts are not equal
 * @throws {TypeError} When the current or desired holdings are in an invalid format
 * @param {Objects<string, number>} currentHoldings The set of account names and their current holdings amounts
 * @param {Objects<string, number>} desiredHoldings The set of account names and their desired holdings amounts
 */
function validateHoldings(currentHoldings, desiredHoldings) {
    if (currentHoldings == null) {
        throw new Error("Missing the current holdings")
    }
    if (desiredHoldings == null) {
        throw new Error("Missing the desired holdings")
    }
    if (!isObject(currentHoldings)) {
        throw new TypeError("Invalid current holdings: must be provided as an object")
    }
    if (!isObject(desiredHoldings)) {
        throw new TypeError("Invalid desired holdings: must be provided as an object")
    }
    if (isEmpty(currentHoldings)) {
        throw new TypeError("Invalid current holdings: no values have been provided")
    }
    if (isEmpty(desiredHoldings)) {
        throw new TypeError("Invalid desired holdings: no values have been provided")
    }
    if (!isValidHoldings(currentHoldings)) {
        throw new Error("Invalid current holdings: must be an object of only numeric values")
    }
    if (!isValidHoldings(desiredHoldings)) {
        throw new Error("Invalid desired holdings: must be an object of only numeric values")
    }
    if (!areHoldingsEqual(currentHoldings, desiredHoldings)) {
        throw new Error(
            "The total value for the desired holdings should still match the total value for the current holdings and Outputs must equate"
        )
    }
}

/**
 * A set of instructions on the movement of funds from accounts
 * 
 * @typedef {Object<string, string|number>} Exchange
 * @property {number} amount The amount being exchanged
 * @property {string} from The account from which the amount is being moved
 * @property {string} to The account to which the amount is being moved
 */

/**
 * Exchanges the holdings amount from their current state to a new state.
 * The holdings are formatted as an object whose keys are account names and whose values are integer amounts representing their current (or desired) amounts.
 *
 * @function
 * @name exchangeHoldings
 * @param {Objects<string, number>} currentHoldings The set of account names and their current holdings amounts
 * @param {Objects<string, number>} desiredHoldings The set of account names and their desired holdings amounts
 * @returns {Array<Exchange>} The exchanges between the current to the desired holdings.
 */
function exchangeHoldings(currentHoldings, desiredHoldings) {
    let exchanges = []
  
    const owedAccounts = Object.keys(desiredHoldings)
        .filter(acctName => (
            currentHoldings[acctName] == null
            || desiredHoldings[acctName] > currentHoldings[acctName]
        ))
        .sort()

    const transferAccounts = Object.keys(currentHoldings)
        .filter(acctName => (desiredHoldings[acctName] || 0) < currentHoldings[acctName])
        .sort()

    for (
        let a = 0,
          lenTransferred = transferAccounts.length,
          lenOwed = owedAccounts.length;
        a < lenTransferred;
        a++
    ) {
        const transferringAcct = transferAccounts[a]
        let transferAmount = (
            currentHoldings[transferringAcct]
            - (desiredHoldings[transferringAcct] || 0)
        )

        let owedAcctIndex = 0

        while (transferAmount && owedAcctIndex < lenOwed) {
            const owedAcct = owedAccounts[owedAcctIndex]
            const owedAmount = (
                desiredHoldings[owedAcct]
                - (currentHoldings[owedAcct] || 0)
            )

            const transferredAmount = exchanges.filter(ex => ex.to === owedAcct)
                .reduce((acc, val) => acc + val.amount, 0)

            if (transferredAmount < owedAmount) {
                const amount = Math.min(transferAmount, owedAmount)
                transferAmount = Math.max(0, transferAmount - amount)

                exchanges.push({
                    from: transferringAcct,
                    to: owedAcct,
                    amount
                })
            }

            owedAcctIndex++
        }
    }

    return exchanges
}

module.exports = {
    isObject,
    isEmpty,
    isValidHoldings,
    validateHoldings,
    areHoldingsEqual,
    toExchangeString,
    sortExchanges,
    exchangeHoldings
}
