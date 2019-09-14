if (!Object.fromEntries) {
  Object.fromEntries = function(entries) {
    return Array.from(entries).reduce(
      (obj, [k, v]) => Object.assign(obj, { [k]: v }),
      {}
    );
  };
}
