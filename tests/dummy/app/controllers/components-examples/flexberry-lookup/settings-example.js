import Ember from 'ember';
import EditFormController from 'ember-flexberry/controllers/edit-form';

export default EditFormController.extend({
  /**
   * Page title.
   *
   * @property title
   * @type String
   * @default 'Components-examples/flexberry-lookup/settings-example'
   */
  title: 'Components-examples/flexberry-lookup/settings-example',

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
