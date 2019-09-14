import { trimForm } from '../utils/form';

const validate = form => {
  let errors = {};

  const trimmed = trimForm(form);

  if (!trimmed.email) {
    errors.email = 'Email address is required';
  } else if (!/\S+@\S+\.\S+/.test(trimmed.email)) {
    errors.email = `Email address ${trimmed.email} is invalid`;
  }

  return errors;
};

export default validate;
