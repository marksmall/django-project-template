import validate from './update-user-form.validator';

describe('Update User Form Validator', () => {
  describe('Failure values', () => {
    const testFields = [
      {
        first_name: 'J', // Error, too short
        last_name: 'Smith'
      },
      {
        first_name: 'James',
        last_name: 'S' // Error, too short
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
        first_name: 'Su',
        last_name: 'Smith'
      },
      {
        first_name: 'John',
        last_name: 'Smith'
      },
      {
        first_name: '',
        last_name: 'Smith'
      },
      {
        first_name: 'John',
        last_name: ''
      }
    ];

    it.each(testFields)('Valid Value %o', form => {
      const errors = validate(form);
      expect(Object.keys(errors).length).not.toBeGreaterThan(0);
    });
  });
});
