var board = "";
var size = 8;
for (var i = 0; i < size; i++) {
  if (i % 2 == 0)
    board += ' ';
  for (var j = 0; j < size; j++) {
    if (j % 2 == 0)
      board += "#";
    else
      board +=" ";
  }
  board += "\n";
}
console.log(board);
