import validate from './password-reset-form.validator';

describe('Password Reset Form Validator', () => {
  describe('Failure values', () => {
    const testFields = [
      {
        // Error, missing `email`
      },
      {
        email: '' // Error, missing value
      },
      {
        email: ' ' // Error, missing value
      },
      {
        email: 'testuser:test.com' // Error, malformed email
      },
      {
        email: 'testuser@testcom' // Error, malformed email
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
        email: 'testuser@test.com'
      }
    ];

    it.each(testFields)('Valid Value %o', form => {
      const errors = validate(form);
      expect(Object.keys(errors).length).not.toBeGreaterThan(0);
    });
  });
});
