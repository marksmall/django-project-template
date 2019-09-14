// Trim form key/values
export const trimForm = form => {
  return Object.keys(form).reduce((acc, key) => {
    acc[key.trim()] = form[key].trim();

    return acc;
  }, {});
};
