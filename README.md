# Async and Await are in stable versions of node! Use that instead!

# roads-coroutine
A simple library to turn javascript generators into promise-returning functions.

## Examples

```js
var cr = require('roads-coroutine');

var fn = cr(function* (param) {
  var result = yield promiseReturningAsyncFunction(param);
  return "final result: " + result;
});

fn('hey!').then(function (response) {
  console.log(response);
}, function (err) {
  console.log(response);
});
```

The tests have even more examples!

## Warning
There are versions of iojs pre-2.5.0 that can generate false "unhandled rejection" events. Please make sure you are using at least 2.5.0
