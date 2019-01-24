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
