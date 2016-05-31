import Ember from 'ember';
import EditFormController from 'ember-flexberry/controllers/edit-form';

export default EditFormController.extend({
  /**
   * Limitation of list of accessible records to be selected as model.master relation.
   *
   * @property masterLookupLimitFunction
   * @type String
   * @default null
   */
  masterLookupLimitFunction: Ember.computed('model.master', function() {
    return null;
  })
});
