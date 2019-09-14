import { trimForm } from '../utils/form';

const validate = form => {
  let errors = {};

  const trimmed = trimForm(form);

  if (!trimmed.new_password1) {
    errors.new_password1 = 'New Password is required';
  } else if (trimmed.new_password1.length < 5) {
    errors.new_password1 = `New Password ${trimmed.new_password1} is too short`;
  } else if (!trimmed.new_password2) {
    errors.new_password2 = 'New Password is required';
  } else if (trimmed.new_password2.length < 5) {
    errors.new_password2 = `New Password ${trimmed.new_password2} is too short`;
  } else if (trimmed.new_password2 !== trimmed.new_password1) {
    errors.new_password2 = `Password ${trimmed.new_password1} doesn't match ${trimmed.new_password2}`;
  }

  return errors;
};

export default validate;
