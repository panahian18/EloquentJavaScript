/*                    Build a Table

An HTML table is built with the following tag structure:

<table>
  <tr>
    <th>name</th>
    <th>height</th>
    <th>place</th>
  </tr>
  <tr>
    <td>Kilimanjaro</td>
    <td>5895</td>
    <td>Tanzania</td>
  </tr>
</table>

For each row, the <table> tag contains a <tr> tag. Inside of these <tr> tags,
we can put cell elements: either heading cells (<th>) or regular cells (<td>).

Given a data set of mountains, an array of objects with name, height, and place
properties, generate the DOM structure for a table that enumerates the objects.

It should have one column per key and one row per object, plus a header row with
<th> elements at the top, listing the column names.

Write this so that the columns are automatically derived from the objects, by
taking the property names of the first object in the data. Add the resulting
table to the element with an id attribute of "mountains" so that it becomes
visible in the document. Once you have this working, right-align cells that
contain number values by setting their style.textAlign property to "right".
*/

<h1>Mountains</h1>

<div id="mountains"></div>

<script>
  const MOUNTAINS = [
    {name: "Kilimanjaro", height: 5895, place: "Tanzania"},
    {name: "Everest", height: 8848, place: "Nepal"},
    {name: "Mount Fuji", height: 3776, place: "Japan"},
    {name: "Vaalserberg", height: 323, place: "Netherlands"},
    {name: "Denali", height: 6168, place: "United States"},
    {name: "Popocatepetl", height: 5465, place: "Mexico"},
    {name: "Mont Blanc", height: 4808, place: "Italy/France"}
  ];

function createTable(array) {
let table = document.createElement("table");
table.appendChild(document.createElement("tr")); // Create an initial row for the headers
 for (let prop in array[0]) { // Here we iterate over the property names for the first mountain
   let child = table.childNodes[0];
   let text = document.createTextNode(prop + " ");
   child.appendChild(document.createElement("th").appendChild(text)); // Populate this row with the header names
 }
for (let i = 1; i < array.length; i++) { // Now iterate over the rest of the array of mountains
    let node1 = document.createElement("tr");
    for (let node in array[i]) {
      let textNode = document.createTextNode(array[i][node] + " ");
      if (typeof(textNode) == "number") textNode.style.textAlign = "right";
      node1.appendChild(textNode);
    }
    table.appendChild(node1);
 }
document.getElementById("mountains").appendChild(table);
}
createTable(MOUNTAINS);

</script>
