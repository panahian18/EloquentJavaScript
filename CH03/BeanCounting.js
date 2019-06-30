function countBs(string) {
  var numBs = 0;
  for (var i = 0; i < string.length; i++) {
    if (string.charAt(i) == 'B')
      numBs++;
  }
  return numBs
}

function countChar(string, char) {
  var numChar = 0;
  for (var i = 0; i < string.length; i++) {
    if (string.charAt(i) == char)
      numChar++;
  }
  return numChar;
}

function countBsNew(string) {
  return countChar(string, "B")
}

console.log(countBs("BeBBee"));
console.log(countChar("Hello", 'l'));
console.log(countBsNew("BeBBee"));
