// Here we build a graph based on the array of strings of roads
function buildGraph(edges) {
   let graph = Object.create(null);
   function addEdge(from, to) {
     if (graph[from] == null)
        graph[from] = [to];
      else
        graph[from].push([to]);
   }
   for (let [from, to] of edges.map(r => r.split("-"))) {
     addEdge(from, to);
     addEdge(to, from);
   }
   return graph;
}

const roadGraph = buildGraph(roads);

// Here we update the state of the village each time the robot moves
class VillageState {
  constructor(place, parcels) {
    this.place = place;
    this.parcels = parcels;
  }
  move(destination) {
    if (!roadGraph[this.place].includes(destination))
      return roadGraph;
    else {
      let parcels = this.parcels.map(p => {
        if (p.place != this.place)
          return p;
        return {place: destination, address: p.address};
      }).filter(p => p.place != p.address);
      return new VillageState(destination, parcels);
    }
  }
}

// Here we want to create a village state, where after each iteration, the entire state updates
class VillageState {
  constructor(parcels, place) {
    this.parcels = parcels;
    this.place = place;
  }
  move (destination) {  // We want to move the robot to a destination and drop off and pick up parcels
    if (!roadGraph[this.place].includes(destination))
      return roadGraph;
    else {
      let parcels = this.parcels.map(p => {
        if (p.place != this.place)
          return p;
        return {place: destination, address: p.address};
      }).filter(p => p.place != p.address); // Here we pick up then drop off any parcels
    }
  }
  return new VillageState(destination, parcels);
}

// Javascript allows us to make immutbale objects by using the freeze function
let object = Object.freeze({value: 5});
object.value = 10;
console.log(object.value);
// -> 5

// A delivery robot considers the state of the world, then decides in whicn dir to move
// A robot also has their memory passed to them and returns a new memory
function runRobot(state, robot, memory) {
    for (let turn = 0;; turn++) {
      if (state.parcels.length == 0) {
        console.log(`finished in ${turn} turns`);
        break;
    }
    let action = robot(memory, state); // A robot takes a state, memory and return a memory and dir.
    state = state.move(robot.direction);
    memory = robot.memory;
    console.log(`Moved to ${action.direction}`);
}

// We could have our robot visit every node by just walking randomly
function randomPick(array) {
  let choice = Math.floor(Math.random() * array.length);
  return array[choice];
}

// This random robot ignores its input memory, and does not return a memory
  function randomRobot(state) {
    return {direction: randomPick(roadGraph[state.place])};
  }
}

// We will now need a way to create a new state with some pacels
VillageState.random = function(parcelCount = 5);
  let parcels = [];
  for (let i = 0; i < parcelCount; i++) {
    let address = randomPick(Object.keys(roadGraph));
    let place;
    do {
      place = randomPick(Object.keys(roadGraph));
    } while (place == address);
  parcels.push({place, address});
}
  return VillageState("Post Office", parcels);
}

// Pathfinding delivery using predifined route
const mailRoute = [
"Alice's House", "Cabin", "Alice's House", "Bob's House",
"Town Hall", "Daria's House", "Ernie's House",
"Grete's House", "Shop", "Grete's House", "Farm",
"Marketplace", "Post Office"];

function routeRobot(state, memory) {
  if (memory.length == 0)
    memory = mailRoute;
  return {direction: memory[0], memory: memory.slice(1)};
}

// Now we use a graph search algorithm to find the paths
// We begin at the starting node and find each next reachable node, then we handle each of those nodes
function findRoute(graph, from, to) {
  let work = [{at: from, route: []}];
  for (let i = 0; i < work.length; i++) {
      let {at, route} = work[i];
      for (let place of graph[at]) {
            if (place == to)
              return route.concat(place);
            if (!work.some(w => w.at == place))
              work.push({at: place, route: route.concat(place)})
      }
  }
}

// Our next robot decides where to go next based on undelivered parcels
function goalOrientedRobot({place, parcels}, route) {
    if (route.length == 0) {
      parcel = parcels[0];
    if (parcel.place != place) {
        route = findRoute(roadGraph, place, parcel.place);
    }
    else {
      route = findRoute(roadGraph, place, parcel.destination);
    }
    return {direction: route[0], memory: route.slice(1)};
    }
  }

function buildGraph(edges) {
  let graph = Object.create(null);
  function addEdge(from, to) {
    if (graph[from] == null)
      graph[from] = [to];
    else
      graph[from].push(to);
    for (let [from, to] of edges.map(r => r.split("-")) {
      addEdge(from, to);
      addEdge(to, from);
    }
    return graph;
}

class VillageState {
  constructor(place, parcels) {
    this.place = place;
    this.parcels = parcels
  }
  move(direction) {
    if (!roadGraph[this.place].includes(direction))
      return this;
    else
        let parcels = this.parcels.map(p => { // We pick up any parcels from our new place
          if (p.place != this.place)
            return p;
          else {
            return {place: destination, address: p.address};
          }).filter(r => p.address != p.place)
              return p;
          });
        return new VillageState(destination, parcels);
    }
  }
}

function runRobot(state, robot, memory) {
  for (let tasks = 0;;task++)
    if (state.parcels.length == 0) {
      console.log(`ended in ${tasks} tasks`);
      break;
    }
  let action = robot(state, memory);
  state = state.move(action.direction);
  memory = action.memory;
  console.log(`moved to ${action.direction}`);
}

// Choose a random element of an array
function randomPick(array) {
  let choice = Math.floor(Math.random * array.length);
  return array[choice];
}

function randomRobot(state) {
  return {direction: randomPick(roadGraph[state.place])}
}

VillageState.random = function(parcelCount = 5) {
  let parcels = [];
  for (let i = 0; i < parcelCount; i++) {
    let address = randomPick(Object.keys(roadGraph)); //Object.keys allows us to access just the prty names of ele.
    let place;
    do {
      place = randomPick(Object.keys(roadGraph));
    } while(address == place);
    parcels[i] = {place, address};
  }
return new VillageState("Post Office", parcels);
}

const mailRoute = [
"Alice's House", "Cabin", "Alice's House", "Bob's House",
"Town Hall", "Daria's House", "Ernie's House",
"Grete's House", "Shop", "Grete's House", "Farm",
"Marketplace", "Post Office"];

function routeRobot(state, memory) {
  if (memory.length == 0)
    memory = mailRoute;
  return {direction: memory[0], memory: memory,slice(1)};
}

function findRoute(graph, from, to) {
  let work = [{at: from, route: []}];
  for (let i = 0; i < work.length; i++) {
      let {at, route} = work[i];
      for (let place of graph[at]) {
          if (place == to)
            return route.concat(place);
          if (!work.some(w => w.at == place)
            work.push({at: place; route: route.concat(place)}));
      }
  }
}

function goalOrientedRobot({place, parcels}, route) {
    if (route.length == 0) {
      let routeLengths = [];
      for (let i = 0; i < parcels.length; i++) {
          routeLengths[i] = findRoute(roadGraph, place, parcels[i].address);
      }
    //  routeLengths = routeLengths.map((x, y) => (x))
      route = routeLengths[0];
    }
    return {direction: route[0], memory: route.slice(1)};
  }
