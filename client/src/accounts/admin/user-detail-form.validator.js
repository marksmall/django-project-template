import { trimForm } from '../../utils/form';

const validate = form => {
  let errors = {};

  const trimmed = trimForm(form);

  if (!trimmed.username) {
    errors.username = 'username is required';
  } else if (trimmed.username.length < 3) {
    errors.username = `username ${trimmed.username} is too short`;
  } else if (trimmed.username.length > 15) {
    errors.username = `username ${trimmed.username} is too long`;
  }

  if (!trimmed.email) {
    errors.email = 'Email address is required';
  } else if (!/\S+@\S+\.\S+/.test(trimmed.email)) {
    errors.email = `Email address ${trimmed.email} is invalid`;
  }

  if (!trimmed.password1) {
    errors.password1 = 'Password is required';
  } else if (!trimmed.password2) {
    errors.password2 = 'Password is required';
  } else if (trimmed.password1.length < 5) {
    errors.password1 = `Password ${trimmed.password1} is too short`;
  } else if (trimmed.password2.length < 5) {
    errors.password2 = `Password ${trimmed.password2} is too short`;
  } else if (trimmed.password2 !== trimmed.password1) {
    errors.password2 = `Password ${trimmed.password1} doesn't match ${trimmed.password2}`;
  }

  return errors;
};

export default validate;
