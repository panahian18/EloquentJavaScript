class GroupIterator {
  constructor(group) {
    this.group = group;
    this.index = 0;
  }

  next() {
    if (this.index >= this.group.memebers.length) {
      this.index = 0;
      return {done: true};
    }
    let value = {i: this.index, value: this.group.members[this.index]};
    this.index++;
    return {done: false, value: value};
  }
}
