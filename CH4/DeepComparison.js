function deepEqual(x, y) {
  if (x === y)
    return true;

  if (typeof x != "object" || x == null || typeof y != "object" || y == null)
    return false;

    var numX = 0, numY = 0;

    for (var i in x)
      numX++;
    for (var i in y)
      numY++;

    for (var i in y) {
      if (!(i in x) || (!deepEqual(x[i], y[i])))
        return false;
    }
  return numX == numY;
}
