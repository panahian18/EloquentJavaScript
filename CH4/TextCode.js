var journal = [
  {events: ["work", "touched tree", "pizza", "running", "television"],
   squirrel: false}
]

var journal = [];

function addEntry(events, didITurnIntoASquirrel) {
  journal.push({
    events: events,
    squirrel: didITurnIntoASquirrel
  });
}

addEntry(["went to work", "school", "etc"], false);

// In this function we iterate through the array of events in journal and keep track of each combination tha occcurs

function hasEvent(event, entry) {
  return entry.events.indexOf(event) != -1;
}

function tableFor(event, journal) {
  var table = [0, 0, 0, 0];
  for (var i = 0; i < journal.length; i++) {
    var index = 0;
    var entry = journal[i];
    if (hasEvent(event, entry))
      index += 1;
    if (entry.squirrel)
      index += 2;
    table[index]++;
   }
   return table;
  }

// Now that we know how to compute all the correlations
// Now we store them using a 'map' object, this allows us to
// store the event, and to bind the value to the event.

var map = {};
function storePhi(event, phi) {
  map[event] = phi;
}

storePhi("pizza", 0.43);
console.log("pizza" in map);

var journal = [];

function addEntry(events, didITurnIntoASquirrel) {
  journal.push({events: events, squirrel: didITurnIntoASquirrel})
}

function addEntry(events, didIturnIntoASquirrel) {
  journal.push({events: events, squirrel: didIturnIntoASquirrel});
}

function hasEvent(event, entry) {
  return entry.events.indexOf(entry)!= -1;
}

function hasEvent(event, entry) {
  return entry.events.indexOf(entry) != -1;
}

// Returns phi per table
function tableFor(event, journal) {
  var table = [0, 0, 0, 0];
  for (var i = 0; i < journal.length; i++) {
    var entry = journal[i], index = 0;
    if (hasEvent(entry, event))
      index++;
    if (entry.squirrel)
      index += 2;
    table[i] += index;
  }
  return table;
}

// This table takes a journal of events, and returns a phi table to be compared
function tableFor(event, journal) {
}

function gatherCorrelations(journal){
  var phis = {};
  for (var entry = 0; entry < journal.length; entry++) {
    var events = journal[entry];
    for (var i = 0; i < events.length; i++) {
      var event = events[i];
      if (!(event in phis))
        phis[event] = phi(tableFor(event, journal));
    }
  }
  return phis;
}

var correlations = gatherCorrelations(JOURNAL);
