function range(start, end, step) {
  if (step = null)
    step = 1;
  var rangeNum = [];
  if (step > 0) {
    for (var i = start; i <= end; i += step)
      rangeNum.push(i);
    } else {
    for (var i = start; i <= end; i += step)
      rangeNum.push(i);
  }
  return rangeNum;
}

console.log(range(1,10,2));

function sum(array) {
 var result = array[0];
  for (var i = 1; i < array.length; i++)
   result += array[i];
  return result;
}

console.log(sum(range(1,10)));
