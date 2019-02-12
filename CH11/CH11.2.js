    // Building Promise.all

/* Given an array of promises, Promise.all returns a promise that waits
*  for all of the promises in the array to finish. It then succeeds, yielding
*  an array of result values. If any of the promises in the array fail, the
*  promise returned by all fails too (with the failure value from the failing
*  promise).
*
* 1.Implement something like this yourself as a regular function called
*  Promise_all.
*
*  Remember that after a promise is resolved (has succeeded or failed), it
*  can’t succeed or fail again, and further calls to the functions that resolve
*  it are ignored. This can simplify the way you handle failure of your
*  promise.
*/

async function Promise_all(promises) {
  return new Promise((resolve, reject) => {
    let promiseValues = [];
	let pendingPromises = promises.length;

    if (promises.length == 0) resolve([]);

	for (let i = 0; i < promises.length; i++) {
      promises[i].then(value => {
        promiseValues[i] = value;
        pendingPromises--;
        if (pendingPromises == 0) resolve(promiseValues);
      })
      .catch(reason => reject(reason));
    }
  });
}

// Test code.
Promise_all([]).then(array => {
  console.log("This should be []:", array);
});
function soon(val) {
  return new Promise(resolve => {
    setTimeout(() => resolve(val), Math.random() * 500);
  });
}
Promise_all([soon(1), soon(2), soon(3)]).then(array => {
  console.log("This should be [1, 2, 3]:", array);
});
Promise_all([soon(1), Promise.reject("X"), soon(3)])
  .then(array => {
    console.log("We should not get here");
  })
  .catch(error => {
    if (error != "X") {
      console.log("Unexpected failure:", error);
    }
  });
