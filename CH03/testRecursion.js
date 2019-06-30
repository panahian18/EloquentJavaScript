function power(base, exponent) {
  if (exponent == 0)
    return 1;
  else
    return base*power(base, exponent - 1);
}

console.log(power(2,3));

 function findSolution(target) {
   function find(current, history) {
     if (current > target)
       return null;
    else if (current == target)
      return history;
    else
      return find(current + 5, "(" + history + " + 5)") ||
             find(current * 3, "(" + history + " * 3)");
    }
    find(1, "1");
   }
   console.log(findSolution(73));
