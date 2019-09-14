if (!Array.prototype.flat) {
  // eslint-disable-next-line
  Array.prototype.flat = function() {
    return this.reduce((res, item) => res.concat(item), []);
  };
}
