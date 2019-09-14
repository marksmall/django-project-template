import { trimForm } from '../utils/form';

const validate = form => {
  let errors = {};

  const trimmed = trimForm(form);

  if (!trimmed.old_password) {
    errors.old_password = 'Old Password is required';
    // FIXME: Don't think old password should be checked for length. It is possible the password was set prior to new length rules.
    // } else if (values.old_password.length < 5) {
    //   errors.old_password = `Old Password ${values.old_password} is too short`;
  } else if (!trimmed.new_password1) {
    errors.new_password1 = 'New Password is required';
  } else if (trimmed.new_password1.length < 5) {
    errors.new_password1 = `New Password ${trimmed.new_password1} is too short`;
  } else if (!trimmed.new_password2) {
    errors.new_password2 = 'New Password is required';
  } else if (trimmed.new_password2.length < 5) {
    errors.new_password2 = `New Password ${trimmed.new_password2} is too short`;
  } else if (trimmed.new_password2 !== trimmed.new_password1) {
    errors.new_password2 = `Password ${trimmed.new_password1} doesn't match ${trimmed.new_password2}`;
  } else if (trimmed.new_password2 === trimmed.old_password) {
    errors.new_password2 = `New Passwords ${trimmed.new_password2} match ${trimmed.old_password}`;
  }

  return errors;
};

export default validate;
