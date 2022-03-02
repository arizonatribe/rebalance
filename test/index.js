const Mocha = require("mocha")
const assert = require("assert")
const { expect } = require("chai")

const Rebalance = require("../lib")
const { sortExchanges } = require("../lib/helpers")

const mocha = new Mocha()

mocha.suite.emit("pre-require", this, "solution", mocha)

describe("Rebalancer", function() {

  it("validates the input values equate to the output values", () => {
    assert.throws(() => {
      let currentHoldings = { YELLOW: 24 }
      let desiredHoldings = { RED: 30 }

      let r = new Rebalance(currentHoldings, desiredHoldings)
      r.solution()
    }, Error, "Inputs and Outputs must equate")
  })

  it("generates exchanges for simple cases", () => {
    let currentHoldings = { YELLOW: 24 }
    let desiredHoldings = { RED: 24 }

    let r = new Rebalance(currentHoldings, desiredHoldings)
    let exchanges = r.solution()
    exchanges = sortExchanges(exchanges)

    let expected = sortExchanges([
      { from: "YELLOW", to: "RED", amount: 24 }
    ])

    expect(exchanges).to.deep.equal(expected)
  })

  it("generates exchanges for more complex cases", () => {
    let currentHoldings = { YELLOW: 10, RED: 20 }
    let desiredHoldings = { YELLOW: 20, RED: 10 }

    let r = new Rebalance(currentHoldings, desiredHoldings)
    let exchanges = r.solution()
    exchanges = sortExchanges(exchanges)

    let expected = sortExchanges([
      { from: "RED", to: "YELLOW", amount: 10 }
    ])
    expect(exchanges).to.deep.equal(expected)
  })

  it("creates exchanges for new ids", () => {
    let currentHoldings = { YELLOW: 10, RED: 10 }
    let desiredHoldings = { YELLOW: 8, RED: 8, GREEN: 4 }

    let r = new Rebalance(currentHoldings, desiredHoldings)
    let exchanges = r.solution()
    exchanges = sortExchanges(exchanges)

    let expected = sortExchanges([
      { from: "YELLOW", to: "GREEN", amount: 2 },
      { from: "RED", to: "GREEN", amount: 2 }
    ])

    expect(exchanges).to.deep.equal(expected)
  })

  it("handles a bunch of elements", () => {
    let currentHoldings = { YELLOW: 3, RED: 2, GREEN: 4, BLUE: 5 }
    let desiredHoldings = { YELLOW: 5, RED: 4, GREEN: 3, BLUE: 2 }

    let r = new Rebalance(currentHoldings, desiredHoldings)
    let exchanges = r.solution()
    exchanges = sortExchanges(exchanges)

    let expected = sortExchanges([
      { from: "GREEN", to: "YELLOW", amount: 1 },
      { from: "BLUE", to: "YELLOW", amount: 1 },
      { from: "BLUE", to: "RED", amount: 2 },
    ])

    expect(exchanges).to.deep.equal(expected)
  })

  it("works when run multiple times", () => {
    let currentHoldings = { YELLOW: 3, RED: 2, GREEN: 4, BLUE: 5 }
    let desiredHoldings = { YELLOW: 5, RED: 4, GREEN: 3, BLUE: 2 }

    let r = new Rebalance(currentHoldings, desiredHoldings)
    let exchanges = r.solution()
    exchanges = sortExchanges(exchanges)

    let expected = sortExchanges([
      { from: "GREEN", to: "YELLOW", amount: 1 },
      { from: "BLUE", to: "YELLOW", amount: 1 },
      { from: "BLUE", to: "RED", amount: 2 },
    ])

    expect(exchanges).to.deep.equal(expected)

    r = new Rebalance(currentHoldings, desiredHoldings)
    exchanges = r.solution()
    exchanges = sortExchanges(exchanges)

    expect(exchanges).to.deep.equal(expected)
  })

  it("uses the optimal number of operations", () => {
    let currentHoldings = { RED: 9, GREEN: 3 }
    let desiredHoldings = { YELLOW: 4, RED: 4, GREEN: 1, BLUE: 2, ORANGE: 1 }

    let r = new Rebalance(currentHoldings, desiredHoldings)
    let exchanges = r.solution()
    exchanges = sortExchanges(exchanges)

    let possibleSolution1 = sortExchanges([
      { from: "RED", to: "YELLOW", amount: 4 },
      { from: "RED", to: "ORANGE", amount: 1 },
      { from: "GREEN", to: "BLUE", amount: 2 }
    ])

    let possibleSolution2 = sortExchanges([
      { from: "GREEN", to: "YELLOW", amount: 2 },
      { from: "RED", to: "YELLOW", amount: 2 },
      { from: "RED", to: "ORANGE", amount: 1 }
    ])

    expect([possibleSolution1, possibleSolution2]).to.deep.include(exchanges)
  })
})

mocha.run()
