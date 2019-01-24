      // Chapter 12 Project: A Programming Language

// In this chapter we build a programming languae called Egg.

    // Parsing

// A parser is a program that reads a piece of text and produces a data structure
// that reflects the structure of the program contained in that text. If the
// text does not form a valid program, the parser should point out the error.

// Everything in Egg is an expression, which can be the name of a binding, a
// number, a string, or an application. Applications are used for function
// calls and also for other constructs such as if or while.

// Egg has no concept of a block, so it needs a do construct to represent doing
// multiple things in sequence. A string is a sequence of characters that are
// not double quotes, wrapped in double quote, a number is a sequence of digits.
// And an application are written the same way in JavaScript.

do(define(x, 10),
  if(>(x, 5),
    print("large"),
    print("small")))
