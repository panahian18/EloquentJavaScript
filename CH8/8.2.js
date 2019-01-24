/*
Consider the following(rather contrived) object:

  let box = {
    locked: true,
    unlock() { this.locked = false; },
    lock() { this.locked = true; },
    _content: [],
    get content() {
      if (this.locked) throw new Error("Locked!");
      return this._content;
    }
  };

It is a box with a lock. Inside is an array, but you can get at it only when the
box is unlocked. Directly accessing the private _content property is forbidden.
Write a function called withBoxUnlocked that takes a function value as argument,
unlocks the box, runs the function, and then ensures that the
box is locked again before returning, regardless of whether the argument function returned normally or threw an exception.
*/

function withBoxUnlocked(body) {
  let lock = box.locked;
  if (!lock) return body();

  box.unlock();
  try {
    return body();
	} finally {
  		box.lock();
	}
}
