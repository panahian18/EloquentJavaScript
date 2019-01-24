    //  Tracking the scalpel

/* The village crows own an old scalpel that they occasionally use on special
*  missions—say, to cut through screen doors or packaging. To be able to
*  quickly track it down, every time the scalpel is moved to another nest,
*  an entry is added to the storage of both the nest that had it and the
*  nest that took it, under "scalpel", pointing at its new location.
*  This means that finding the scalpel is a matter of following the breadcrumb
*  trail of storage entries, until you find a nest where that points at
*  the nest itself.
*
*
* 1.Write an async function locateScalpel that does this, starting at the
*   nest on which it runs. You can use the anyStorage function defined
*   earlier to access storage in arbitrary nests. The scalpel has been going
*   around long enough that you may assume that every nest has a "scalpel"
*   entry in its data storage.
*
* 2.Next, write the same function again without using async and await.
*
* 3.Do request failures properly show up as rejections of the returned
*   promise in both versions? How?
*/

// Finds which nest current contains the scalpel, starting with the nest provided.
async function locateScalpel(nest) {
let current = nest.name; // Set current to the starting nest
  for (;;) {  // iterate until we find the correct nest
    let next = await anyStorage(nest, current, "scalpel"); // hold on to where the current nest's "scalpel" points to
    if (next == current) return current;  // If our current nest has the scalpel then return it.
    current = next; // Follow the path
  }
}

// Do the same as above but don't use async and await
function locateScalpel2(nest) {
  function loop(current) {
    return anyStorage(nest, current, "scalpel").then(next => {
      if (next == current) return current;
      else return loop(next);
    });
  }
  return loop(nest.name);
}
