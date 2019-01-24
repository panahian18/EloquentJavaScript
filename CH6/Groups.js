class Group {
  constructor() {
    this.members = [];
  }

  add(value) {
    if (!this.has(value))
      this.members.push(value);
  }

  delete(value) {
    if (this.has(value)) {
      for (let value of this.members) {
        if (this.members[this.members.indexOf(value)] == value)
        this.members[this.members.indexOf(value)] = null;
      }
    }
  }

  /*
    Alternate version of delete()
    delete(value) {
    retur this.members = this.members.filter(v => v !== value);
  }
  */

  has(value) {
    for (let i = 0; i < this.members.length; i++)
      if (this.members[i] == value)
        return true;
      else return false;
  }

  static from(iterable) { // takes an iterable object and creates a group that contains all values produced by iterating over it.
    let newGroup = new Group();
    for (let i of iterable) {
      newGroup.add(i);
    }
    return newGroup;
  }
}


let group = Group.from([10, 20]);
console.log(group.has(10));
// → true
console.log(group.has(30));
// → false
group.add(10);
group.delete(10);
console.log(group.has(10));
// → false
