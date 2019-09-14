import validate from './login-form.validator';

describe('Login Form Validator', () => {
  describe('Failure values', () => {
    const testFields = [
      {
        username: '', // Error, missing
        email: 'user@test.com',
        password: 'password'
      },
      {
        username: 'user',
        email: '', // Error, missing
        password: 'password'
      },
      {
        username: 'user',
        email: 'user@test.com',
        password: '' // Error, missing
      },
      {
        username: 'su', // Error, too short
        email: 'user@test.com',
        password: 'password'
      },
      {
        username: 'user',
        email: 'user@test.com',
        password: 'pass' // Error, too short
      },
      {
        username: 'user',
        email: '@test.com', // Error, missing username, prior to `@`
        password: 'password'
      },
      {
        username: 'user',
        email: 'usertest.com', // Error, missing `@`
        password: 'password'
      },
      {
        username: 'user',
        email: 'user@test', // Error, missing `.com|.net` etc
        password: 'password'
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
        username: 'user',
        email: 'user@test.com',
        password: 'password'
      },
      {
        username: 'jon',
        email: 'user@test.com',
        password: 'password'
      },
      {
        username: 'user',
        email: 'user@test.com',
        password: 'paswd'
      },
      {
        username: 'user',
        email: 'a@b.c',
        password: 'password'
      }
    ];

    it.each(testFields)('Valid Value %o', form => {
      const errors = validate(form);
      expect(Object.keys(errors).length).not.toBeGreaterThan(0);
    });
  });
});
