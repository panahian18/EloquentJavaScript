                // Chapter 11 - Asyncrhonous JavaScript

// Previous examples were programs written that were executed synchronously,
// that is, they were executed one at a time, however if a program has to access
// a part of the computer that is not the processor, then it will make the
// processor sit idle. Your operating system will then use this idle processor
// to handle another task, however we want our program to take advantage of this
// idling for our own program.

    // Asynchronicity

// In an asyncrhonous program, when an action is started, the program continues
// to run, and when the action finishes, then the program is informed and gets
// the results.

// Consider a program that fetches two resources from a network then combines
// the results. In a synchronous program, the two fetches are retrieved
// consecutively. This is very inefficient, so the solution to this is to have
// two threads of control.

// In an asyncrhonous model, starting a newtork action conceptually causes a
//split in the timeline. The program that initiated the action continues running,
// and the action happens alongside it, notifiying the program when it is finished.

    // Callbacks

// One approach to asyncrhonous programming is to take a slow function and give
// an extra argument, a callback function. The action starts and when it finishes
// the callback function is called with the result. setTimeout waits a few miliseconds
// and then calls a function.

setTimeout(() => console.log("Tick"), 500);

// We can chain multiple callback functions for functions that require time to
// complete their action. Ex. fetching data from the data source takes some time

import {bigOak} from "crow-tech";

bigOak.readStorage("food caches", caches => {  // first function with callback
    let firstCache = caches[0];                // part of callback
    bigOak.readStorage(firstCache, info => { // still part of callback, itself a callback
    console.log(info);
  });
});

// Imagine we can send messages between two points of communication, this means
// that we send request-response pairs. One node sends a message to another node
// which then immediately sends a message back, confirming receipt and possibly
// including a response. Each message has a type, which determines how it is
// handled, this means there are handlers for each type of message.

// The bigOak has a send method, that takes the name of the nest, type and mes.
// and a function to call when a response comes in (callback function)
bigOak.send("Cow Pasture", "note", "Let's caw loudly at 7PM",
  () => console.log("Note Delivered"));

// In order to make the above work, we need to define a request type named "note",
// The defineRequestType function defines a new type of request and implements
// a handler. Our implementation simply calls console.log.

import {defineRequestType} from "crow-tech";

defineRequestType("note", (nest, content, source, done) => {  // This function takes a function and stores that under "name"
  console.log(`${nest.name} received note: ${content}`);      // Later, nest.send() will call this function and provide the necessary arguments.
  done();
});

// done() is a callback function that it must call when it is done with the
// request. We could have used the functions return value as a response, but then
// it wouldn't be asyncrhonous. So we need another function (in this case done())
// to let us know when it is finished, this way the handler is also asynchronous.

      // Promises

// A promise is an action that may complete at some point and produce a value.
// Instead of arranging for a function to be called when our function is finished
// executing, we could instead return an object that represents this future value.
// A promised value might already be there or it might appear at some point in the
// future. Computations on promised values execute async. as they become available.

// The easiest way to create a Promise is by calling Promise.resolve and passing
// a value, it will wrap your value in a promise and return it.

  let fifteen = Promise.resolve(15);
  fifteen.then(value => console.log(`Got ${value}`));
  // -> Got 15

// .then() returns the result of the promise. It registers a callback to be called
// when the promise resolves and produces a value. It also returns another promise
// which resolves to the value that the handler returns. If that promise returns
// a promise then it waits for that to resolve then resolves to its value.

// To create a Promise, you can use the constructor, which expects a function as
// an argument, which it immediately calls, passing it a function that it can
// use to resolve the promise.

// Example for our readStorage function

function storage(nest, name) {
  return new Promise(resolve => {
      nest.readStorage(name, result => resolve(result));
  });
}

storage(bigOak, "enemies")
  .then(value => console.log("Got", value));

    // Failure

// Async functions need a method for throwing exceptions when they fail, similar
// to regular functions. Making sure failures are properly reported with callback
// functions is extremely difficult, such callbacks must ensure if they have
// received exceptions or if any functions they call throw exceptions.

// Promises make this simple. They can either be resolved (action is successful)
// or rejected (failure). Resolve handlers (registered with then) are only called
// when the action is successful, and rejections are automatically propogated to
// the new promise returned by then. When a handler throws an exception, this
// automatically causes the promise produced by its then call to be rejected.

// So if any element in a chain of asyncrhonous actions fails, the outcome of the
// whole chain is marked as rejected, and no handlers are called thereafter.
// Rejecting a promise provides a value of rejection, also called the reason of
// rejection. When a handler function throws an exception, that is the reason.
// When a handler returns a promise that is rejected, that rejection flows into
// the next promise.

// Promise.reject creates a new, immediately rejected promise.

// Promises come with a function called catch, that registers a handler that is
// called when the promise is rejected, similar to how then handles normal
// resolutions. It also returns a new promise, which resolves to the original
// promise's value if it resolves normally, and to the result of the catch
// handler if it is rejected.

// As a shorthand, .then accepts a rejection handler as a second argument. The
// Promise constructor accepts a rejection function as a second argument, which
// it can use to reject the new promise. Chains of promises can be created by
// calls to then and catch. JavaScript environments can tell when a promise
// rejection isn't handled and will report this as an error.

new Promise((_, reject) => reject(new Error("Fail")))
  .then(value => console.log("Handler 1"));
  .catch(reason => {
    console.log("Caught failure " + reason);
    return "nothing";
  });
  .then(value => console.log("Handler 2", value));
// → Caught failure Error: Fail
// → Handler 2 nothing

    // Networks are hard

// Considering our send method from our Nest class mentioned previously, it is
// reasonable to expect that messages that are sometimes sent might not be
// received, so it is useful to make it try again if a sent message does not
// receive a response and to stop give up after a while and report a failure.

// Sometimes when a request and response are successfully delivered, the reponse
// may indicate failure, as is the case when the wrong type is used in
// defineRequestType.

class Timeout extends Error {};

function request(nest, target, type, content) { // here we wrap the send method to handle possible timeouts
  new Promise((resolve, reject) => {  // create a new promise to wrap the send method, takes 2 functions as args
    let done = false;
    function attempt(n) { // create a separate function for our main action in order to call it again
      nest.send(target, type, content, (failed, value) => { // call nest.send as usual
        done = true;  // create a use once only state
        if (failed) reject(failed);
        else resolve(value);
      });
      setTimeout(() => {  // create recursive feature to call itself
        if (done) return;
        else if (n < 3) attempt(n+1);
        else reject(new Timeout("Timed Out"));
      }, 250);
    }
    attempt(1);
  });
}

// Now we will wrap the defineRequestType function to allow the handler function
// to return a promise or even a plain value, and wire that up to the callback

function requestType(name, handler) {
    defineRequestType(name, (nest, content, source, callback) => {
      try {
        Promise.resolve(handler(nest, content, source))
          .then(response => callback(null,response),
                failure => callback(failure));
      } catch (exception) {
          callback(exception);
      }
    });
}

    // Collections of Promises

// Each nest has a array of other nests within transmission distance in an array
// called neighbors. We will write a function that sends a ping request to each
// of them and see which comes back.

// Promise.all is a function that given a collection of promises (an array) will
// wait for all the promises in the array to resolve, then resolves to an array
// of values that the promises produced (in the same order). If any promise is
// rejected then the result of Promise.all is itself rejected.

requestType("ping", () => "pong");

function availableNeighbors(nest) {
  let requests = nest.neighbors.map(neighbor => {
      return request(nest, neighbor, "ping")
        .then(() => true, () => false);
  });
  return Promise.all(requests).then(result => {
    return nest.neighbors.filter((_, i) => result[i]);
  });
}

// This function first maps all nests in the neighbors array where the test is
// if they send a "pong" when sent a "ping" request. This is done to make sure
// only functioning nests are used to call Promises.all to get a useful result.
// In the handler for the aggregate promise, filter is used to remove those
// elements from the array whose corresponding value is false.

    // Network Flooding

// We now want to allow nests to be able to talk to all neighbors. First, a type
// of request is forwarded to their neighbor, then their neighbor's neighbor, etc.

import {everwhere} from "crow-tech";

// To prevent sending the same message around the network forever, each nest
// keeps an array of gossip strings it has already seen. The everwhere function
// runs code on every nest (node), adding to the nest's state object.

everywhere(nest => {
    nest.state.gossip = [];
});

// This function simply sends the message to its neighbors, which then sends it
// to its neighbors, assuming its neighbor is not null
function sendGossip(nest, message, exceptFor=null) {
  nest.state.gossip.push(message);  // First add the gossip message to the sending nest
  for (let neighbor of nest.neighbors) {  // Iterate through all of the current nest's neighbors
  if (neighbor == exceptFor) continue;  // If the neighbor matches the exception nest then don't send it, when this function is called, it will send the sending nest as an argument
  request(nest, neighbor, "gossip", message); // Send the message
  }
}

requestType("gossip", (nest, message, source) => {
  if (nest.state.gossip.includes(message) return; // If the nest the message being sent to has the message then back out of the function
  console.log(`${nest.name} received gossip ${message} from ${source}`);  // Let caller know that the message was sent
  sendGossip(nest, message, source);  // Now we call the sendGossip function to allow us to send the message to all of nest's neighbors
});

    // Message Routing

// If a given node wants to talk to a single other node, then flooding is not a
// useful tool. We need to set up a way for messages to hop from node to node
// until they reach their destination, so each node have to know about the entire
// network. To send a message to a far away node, it is necessary to know which
// neighbor gets it closer to its destination.

// We must spread the info about the connections between nodes to all nodes in a
// way that can change over time if a node is deleted. We do this by flooding,
// checking whether the new set of neighbors for a given nest matches the
// current set we have now.

// This defines a type of request, nest is given all the connections that source
// has, then it calls broadcastConnections to send information to nest's
// neighbors, etc.
requestType("connections", (nest, {name, neighbors}, source) => {
    let connections = nest.state.connections;
    if (JSON.stringify(connections.get(name)) ==
        JSON.stringify(neighbors)) return;
    connections.set(name, neighbors);
    broadcastConnections(nest, name, source);
  });

// This function takes a nest and another node and makes a "connections" request
// for all its neighbors.
function broadcastConnections(nest, name, exceptFor=null) {
    for (let neighbor of nest.neighbors) {
        if (neighbor == exceptFor) continue;
        request(nest, neighbor, "connections", {
            name,
            neighbors: nest.state.connections.get(name)
        });
    }
}

// This function starts the chain reaction to spread the map to all nodes.
everywhere(nest => {
    nest.state.connections = new Map;
    nest.state.connections.set(nest.name, nest.neighbors);
    broadcastConnections(nest, nest.name);
});

// The findRoute function, which resembles the findRoute function from chapter
// 7, searches for a way to reach a given node in the network. But instead of
// returning the whole route, it just retunrs the next step, that next nest, given
// information about the network will iself decide where to send the message.

function findRoute(from, to, connections) { // We are given a starting node (from) and a destination (to), along with all the nodes "from" is connected to
  let work = [{at: from, via: null}]; // Here we start to build our path, starting with the first node in consideration, which is the from node
  for (let i = 0; i < work.length; i++) {
    let {at, via} = work[i]; // We will now consider the newest node in our path and determine the next node to go to
    for (let next of connections.get(at) || []) { // For the furthest node in our path, we will consider all of its connecting nodes
        if (next == to) return via; // If any of the connecting nodes is our destination, then return our path
        if (!work.some(w => w.at == next)) { // Only consider connecting nodes if they aren't already in our path (work)
          work.push({at: next, via: via || next}); // Now add all connecting nodes
        }
      }
    }
    return null;
  }

// Now we will build a function that can send long-distance messages. If that
// destination is a direct neighbour then it will deliver it as usual,
// otherwise it will use the "route" request type, which uses findRoute.

function routeRequest(nest, target, type, content) { // This function will build a route to our target then it will call "request" to send it
  if (nest.neighbors.includes(target)) {  // If we have a path to the target then simply use "request" to send it
      return request(nest, target, type, content);
  } else {
    let via = findRoute(nest.name, target, nest.state.connections); // If we didn't have a path to the target then we will build it using findRoute
    if (!via) throw new Error(`No route to ${target}`);
    return request(nest, via, "route", {nest, target, content}); // Now that we have a path we will recall the "route" request with our newly created path
  }
}

requestType("route", (nest, target, type, content)) => { // This request calls the routeRequest funciton above, it creates a path for the "request" function
  return routeRequest(nest, target, type, content); // to send a message
});

    // Async functions

// Imagine we want to store information of each node in every node

// Functions that use promises can still be difficult to understand. It would be
// a lot easier to write async code synchronously, JavaScript allows us to
// do this using the "async" keyword. An async function returns a promise and in
// its "await" will await other promises in a way that looks syncrhonous.

requestType("storage", (nest, name) => storage(nest, name));  // create a new request type that uses a storage function

function findInStorage() { // This function will attempt to find a node from a given nest
  return storage(nest, name).then(found => {
    if (found != null) return found;  // In this case, we have found the node we are looking for
    else return findInRemoteStorage(nest, name);  // Attempt to find in other nodes using the findRemote function
  });
}

function network(nest) {  // This returns the set of all nodes for the network
  return Array.from(nest.state.connections.keys());
}

// Find a node that is somewhere in the network, from a starting node.
async function findInRemoteStorage(nest, name) {
  let local = await storage(nest, name);
  if (local != null) return local;

  let sources = network(nest).filter(n => n != nest.name);
  while (sources.length > 0 ) {
    let source = sources[Math.floor(Math.random * sources.length)];
    sources = sources.filter(n => n != source);
    try {
      let ok = await routeRequest(nest, source, "storage", name);
      if (ok != null) return ok;
    } catch (_) {}
  }
  throw new Error("Not found");
}

// async functions return promises, when their body returns something, the
// promise is resolved, and when they throw an exception, the promise is rejected.
// Inside an async function, you can put "await" before any expression, which
// prodcues a promise, and waits for that promise to resolve, and only then continue.

    // Generators

// In addition to async functions, generator functions also have the ability
// to be paused, however these functions do not have promises. Generators are
// created with function*. When you call a generator, they return an iterator.

function* powers(n) {
    for (let current = n;; current *= n) {
      yield current;
    }
}

for (let power in powers(3)) {
  if (power > 50) break;
  console.log(power);
}

// When power is called, it is freezed from the start, every time next is called,
// the function pauses and causes yield to become the next value produced by the
// iterator. When the function returns (this one never does) the iterator is done.

// We can use generators to build iterators.

Group.prototype[Symbol.iterator] = function*() {
  for (let i = 0; i < this.members.length; i++) {
    yield this.members[i];
  }
}

// An async function is a special type of generator, it produces a promise when
// called, which is resolved when it returns (finishes) and rejected when it
// throws an exception. Whenever it yields (awaits) a promise, the result of
// that promise is (value or thrown exception) is the result of the await exp.

    // The Event Loop

// Async programs are executed piece by piece, each piece may start some some
// actions and schedule code to be executed when the action finishes or fails.
// In between these pieces, the program sits idle, waiting for the next action.
// Async behaviour happens on its own empty function stack, which makes
// managing exceptions across asyncrhonous code hard.

try {
  setTimeout(() => {
    throw new Error("Woosh");
  }, 20);
} catch(_) {
  // This will not run
  console.log("Caught");
}

// Promises always resolve or reject as a new event. This event gets added to the
// end of the event loop so it will get called after the current script finishes.

Promise.resolve("Done").then(console.log);
cconsole.log("Me First!");
// -> Me First!
// -> Done

    // Async Bugs

// Syncrhonous programs do not have any state changes except for the ones that
// the program makes itself. But asyncrhonous programs do create gaps in their
// execution that can allow for other code to run.

// Each nest in the network count the number of chicks that are born every year
// nests store this count in the "storage" bulb.

// Retrive the information stored under "name", if not found then use routeRequest to send it.
function anyStorage(nest, source, name) {
  if (source == nest.name) return storage(nest, name);
  else return routeRequest(nest, source, "storage", name);
}

async function chicks(nest, year) {

}
