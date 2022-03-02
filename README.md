## Rebalance Account Holdings Excercise

This coding exercise explores the transfer of values (integers) from one object to another without changing the overall total value of all key/val pairs in the object.


Say you have an object like this:

```json
{
  "RED": 700,
  "BLUE": 850,
  "GREEN": 325
}
```

And you want to move the amounts so that the totals are more like this:

```json
{
  "RED": 100,
  "ORANGE": 200,
  "GREEN": 1575
}
```

This is kind of like shuffling account holdings in financial applications. You _don't_ want to lose any of the amount in your overall portfolio, however you _do_ want to move those values around sometimes.

So you just need to ensure that values are shuffled within the rules.


### Usage

```javascript
const Rebalance = require("./lib")

const rebalancer = new Rebalance(
    /* current holdings */
    { RED: 700, GREEN: 330, BLUE: 70 },
    /* desired holdings */
    { RED: 300, GREEN: 400, BLUE: 400 },
)

rebalancer.solution()

// [
//   { from: 'RED', to: 'BLUE', amount: 330 },
//   { from: 'RED', to: 'GREEN', amount: 70 }
// ]
```

### Tests

There are a set of unit tests - given in the code exercise without the validation or exchange/transfer logic implemented.

So to run the tests:

```
npm test
```

Or with file-watch:

```
npm run test:watch
```
