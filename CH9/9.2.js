// This regex replaces all single quotation marks with double quotation marks
// except in cases where it is used as a contraction.

let text = "'I'm the cook,' he said, 'it's my job.'";
// Change this call.
console.log(text.replace(/(^|\W)'|'(\W|$)/, "\""));
// → "I'm the cook," he said, "it's my job."
