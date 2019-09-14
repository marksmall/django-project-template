import validate from './register-form.validator';

describe('Register Form Validator', () => {
  describe('Failure values', () => {
    const testFields = [
      {
        // Error, missing `username`
        email: 'testuser@test.com',
        password1: 'password',
        password2: 'password'
      },
      {
        username: '', // Error, missing value
        email: 'testuser@test.com',
        password1: 'password',
        password2: 'password'
      },
      {
        username: ' ', // Error, missing value
        email: 'testuser@test.com',
        password1: 'password',
        password2: 'password'
      },
      {
        username: 'su', // Error, value to short
        email: 'testuser@test.com',
        password1: 'password',
        password2: 'password'
      },
      {
        username: 'testusertestuser', // Error, value to long
        email: 'testuser@test.com',
        password1: 'password',
        password2: 'password'
      },
      {
        // Error, missing `email`
        username: 'testuser',
        password1: 'password',
        password2: 'password'
      },
      {
        username: 'testuser',
        email: '', // Error, missing value
        password1: 'password',
        password2: 'password'
      },
      {
        username: 'testuser',
        email: ' ', // Error, missing value
        password1: 'password',
        password2: 'password'
      },
      {
        username: 'testuser',
        email: 'testuser:test.com', // Error, malformed email
        password1: 'password',
        password2: 'password'
      },
      {
        username: 'testuser',
        email: 'testuser@testcom', // Error, malformed email
        password1: 'password',
        password2: 'password'
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
        username: 'testuser',
        email: 'testuser@test.com',
        password1: 'password',
        password2: 'password'
      }
    ];

    it.each(testFields)('Valid Value %o', form => {
      const errors = validate(form);
      expect(Object.keys(errors).length).not.toBeGreaterThan(0);
    });
  });
});
