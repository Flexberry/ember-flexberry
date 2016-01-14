import Ember from 'ember';
import EditFormController from 'ember-flexberry/controllers/edit-form';

export default EditFormController.extend({
  // Caption of this particular edit form.
  title: 'Employee',

  /**
   * Current function to limit accessible values of model employee1.
   *
   * @property lookupLimitFunction
   * @type String
   * @default undefined
   */
  lookupLimitFunction: Ember.computed('model.employee1', function() {
    let currentLookupValue = this.get('model.employee1');
    if (currentLookupValue) {
      let currentLookupText = this.get('model.employee1.firstName');
      return 'FirstName ge \'' + currentLookupText + '\'';
    }

    return undefined;
  }),

  /**
   * Url to get all availible entities of relation 'employee1'.
   *
   * @property autoCompleteEmployeeLookupUrl
   * @type String
   */
  autoCompleteEmployeeLookupUrl: Ember.computed(function() {
    return this.getLookupAutocompleteUrl('employee1');
  })
});
