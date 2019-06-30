// returns a list of given array
function arrayToList(array) {
  var list = null;
  for (var i = array.length - 1; i >= 0; i--)
    list = {value: array[array.length - i], rest: list};
  return list;
}

// returns an array from a given list
function listToArray(list) {
  var array = [];
  for (var node = list; node; node = node.rest)
    array.push(node.value);
  return array;
}

// returns new list with element added to front of input list
function prepend(element, list) {
  var newList = {value: element, rest: list};
  return newList;
}

// recursively returns element at index n of list else returns undefined
function nth(list, n) {
  if (!list)
    return undefined;
  else if (n == 0)
    return list.value;
  else nth(list.rest, n - 1);
}
