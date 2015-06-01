import EditFormController from 'prototype-ember-cli-application/controllers/edit-form';

export default EditFormController.extend({
  // Route to redirect to when closing.
  parentRoute: "employees",

  // Validation rules.
  validations: {
    firstName: {
      presence: true,
      length: { minimum: 5 }
    },
    lastName: {
      presence: true,
      length: { minimum: 5 }
    }
  }
});
