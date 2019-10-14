import { trimForm } from '../utils/form';

const validate = form => {
  let errors = {};

  const trimmed = trimForm(form);

  if (!trimmed.username) {
    errors.username = 'Username is required';
  } else if (trimmed.username.length < 3) {
    errors.username = `Username ${trimmed.email} is too short`;
  }

  if (!trimmed.email) {
    errors.email = 'Email address is required';
  } else if (!/\S+@\S+\.\S+/.test(trimmed.email)) {
    errors.email = `Email address ${trimmed.email} is invalid`;
  }

  if (!trimmed.password) {
    errors.password = 'Password is required';
  } else if (trimmed.password.length < 5) {
    errors.password = `Password ${trimmed.password} is too short`;
  }

  return errors;
};

export default validate;
