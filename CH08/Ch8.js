// Sample test cases
function test(label, body) {
  if (!body()) console.log(`Failed: ${label}`);
}

test("Convert Latin text to upper case", () => {
  return "hello".toUpperCase() == "Hello";
});

// Sometimes it is necessary to check for errors that come from the outside world
function promptNumber(question) {
  let result = Number(prompt(question));
  if (isNaN(result)) return null;
  else return result;
}

console.log(promptNumber("How many trees do you see?"));

// We can also return special values when finding errors
function lastElement(array) {
  if (array.length == 0) {
    return {failed: true};
  } else {
    return {element: array[array.length-1]};
  }
}

// Exceptions are a mechanism that make it possible for code that runs into a problem to to throw an Exception
// They can be any value, when thrown, they rise up the call stack until it reaches the caller of the stack or a catch
function promptDirection(question) {
  let result = prompt(question);
  if (result.toLowerCase() == "left") return "L");
  if (result.toLowerCase()) == "right") return "R");
  throw new Error("Invalid direction" + result);
}

function look() {
  if (promptDirection("which way?") == "L")
    return "a house";
  else
    return "two angry bears";
}

// This try/ catch block will attempt whatever's in the try block and if an error is found, it will be caught by the
// catch block and the body of it will be executed, if no error then catch block will be ignored.
try {
  console.log("You see", look());
} catch (error) {
  console.log("Something went wrong: " + error);
  }

  // Try block also have a finally block, which means in addition or instead of catch, it must do whats in the finally block
function transfer(from, amount) {
  if (accounts[from] < amount) return;
  let progress = 0;
  try {
      accounts[from] -= amount;
      progress = 1;
      accounts[getAccount()] += amount;
      progress = 2;
  } finally {
    if (progress == 1) {
      accounts[from] += amount;
    }
  }

  // We can use selective exceptions by using different error classes for different errors
  class InputError extends Error {}

  for (;;) {
    try {
      let dir = promptDirection("Where?");
      console.log("You chose ", dir);
      break;
    } catch (e) {
      if (e instanceof InputError) {
        console.log("Not a valid direction. Try again.");
      } else {
        throw e;
      }
    }
  }

  // Assertions are checks inside a program that verify that something is the way its supposed to be
  function firstElement(array) {
    if (array.length == 0) {
      throw new Error("firstElement called with []");
    }
    return array[0];
  }
