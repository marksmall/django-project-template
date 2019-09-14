import validate from './password-reset-confirm-form.validator';

describe('Password Reset Confirm Form Validator', () => {
  describe('Failure values', () => {
    const testFields = [
      {
        // Error, missing `new_password1`
        new_password2: 'password'
      },
      {
        new_password1: '', // Error, missing value
        new_password2: 'password'
      },
      {
        new_password1: ' ', // Error, missing value
        new_password2: 'password'
      },
      {
        new_password1: 'pass', // Error, value too short
        new_password2: 'password'
      },
      {
        // Error, missing `new_password2`
        new_password1: 'password'
      },
      {
        new_password1: 'password',
        new_password2: '' // Error, missing value
      },
      {
        new_password1: 'password',
        new_password2: ' ' // Error, missing value
      },
      {
        new_password1: 'password', // Error, value too short
        new_password2: 'pass'
      },
      {
        new_password1: 'password', // Error, passwords don't match
        new_password2: 'pass'
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
