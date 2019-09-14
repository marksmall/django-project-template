if (!Array.prototype.flatMap) {
  // eslint-disable-next-line
  Array.prototype.flatMap = function(fn) {
    return this.reduce((res, item) => res.concat(fn(item)), []);
  };
}
