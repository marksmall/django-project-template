import { trimForm } from '../utils/form';

const validate = form => {
  let errors = {};

  const trimmed = trimForm(form);

  if (trimmed.first_name) {
    if (trimmed.first_name.length < 2) {
      errors.first_name = `First name ${trimmed.first_name} is too short`;
    }
  }

  if (trimmed.last_name) {
    if (trimmed.last_name.length < 2) {
      errors.last_name = `Last name ${trimmed.last_name} is too short`;
    }
  }

  return errors;
};

export default validate;
