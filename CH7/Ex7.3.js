
// Should work for keys of any type not just strings
// Constructor should not be part of the interface, but should be used internally
// There is an empty instance PGroup.empty that can used as a starting values
class PGroup {
  constructor() {
    this.members = [];
  }

    add (value) {
    if (!this.has(value)) {
      	let temp = this.members.slice();
        temp.push(value);
    	let newInst = new PGroup();
      	newInst.members = temp;
    	return newInst;
    	}
    }
    delete (value) {
   	  	let temp = this.members.filter(v => v !== value);
      	let newInst = new PGroup();
      	newInst.members = temp;
      	return newInst;
    }
  has (value) {
    return this.members.includes(value);
}
    static from(collection) {
    let group = new PGroup;
    for (let value of collection) {
      group.add(value);
    }
    return group;
  }
}

PGroup.empty = new PGroup();


let a = PGroup.empty.add("a");
let ab = a.add("b");
let b = ab.delete("a");
console.log(b.has("b"));
// → true
console.log(a.has("b"));
// → false
console.log(b.has("a"));
// → false
