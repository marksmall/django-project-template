import { trimForm } from '../utils/form';

const validate = form => {
  let errors = {};

  const trimmed = trimForm(form);

  if (!trimmed.username) {
    errors.username = 'Username is required';
  } else if (trimmed.username.length < 3) {
    errors.username = `Username ${trimmed.email} is too short`;
  }

  if (!trimmed.password) {
    errors.password = 'Password is required';
  } else if (trimmed.password.length < 5) {
    errors.password = `Password ${trimmed.password} is too short`;
  }

  return errors;
};

export default validate;
