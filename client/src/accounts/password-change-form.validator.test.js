import validate from './password-change-form.validator';

describe('Change Password Form Validator', () => {
  describe('Failure values', () => {
    const testFields = [
      {
        // Error, missing `old_password`
        new_password1: 'password',
        new_password2: 'password'
      },
      {
        old_password: '', // Error, missing value
        new_password1: 'password',
        new_password2: 'password'
      },
      {
        old_password: ' ', // Error, empty value
        new_password1: 'password',
        new_password2: 'password'
      },
      {
        // Error, missing `new_password1`
        old_password: 'password',
        new_password2: 'password'
      },
      {
        old_password: 'password',
        new_password1: '', // Error, missing value
        new_password2: 'password'
      },
      {
        old_password: 'password',
        new_password1: ' ', // Error, empty value
        new_password2: 'password'
      },
      {
        old_password: 'password',
        new_password1: 'pass', // Error, too short
        new_password2: 'password'
      },
      {
        // Error, missing `new_password2`
        old_password: 'password',
        new_password1: 'password'
      },
      {
        old_password: 'password',
        new_password1: 'password',
        new_password2: '' // Error, missing value
      },
      {
        old_password: 'password',
        new_password1: 'password',
        new_password2: ' ' // Error, empty value
      },
      {
        old_password: 'password',
        new_password1: 'password',
        new_password2: 'pass' // Error, too short
      },
      {
        old_password: 'password',
        new_password1: 'password',
        new_password2: 'pass' // Error, doesn't match `new_password1`
      },
      {
        old_password: 'password',
        new_password1: 'password',
        new_password2: 'password' // Error, new passwords match old password`
      }
    ];

    it.each(testFields)('Invalid Value %o', form => {
      const errors = validate(form);
      expect(Object.keys(errors).length).toBeGreaterThan(0);
    });
  });

  describe('Success values', () => {
    const testFields = [
      {
        old_password: 'changeme',
        new_password1: 'password',
        new_password2: 'password'
      }
    ];

    it.each(testFields)('Valid Value %o', form => {
      const errors = validate(form);
      expect(Object.keys(errors).length).not.toBeGreaterThan(0);
    });
  });
});
