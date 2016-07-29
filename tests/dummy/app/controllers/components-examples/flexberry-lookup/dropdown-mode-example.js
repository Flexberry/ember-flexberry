import Ember from 'ember';
import EditFormController from 'ember-flexberry/controllers/edit-form';
import { Query } from 'ember-flexberry-data';

const { StringPredicate } = Query;

export default EditFormController.extend({
  /**
    Current predicate to limit accessible values for lookup in dropdown mode.

    @property lookupCustomLimitPredicate
    @type BasePredicate
    @default undefined
   */
  lookupCustomLimitPredicate: Ember.computed(function() {
    return new StringPredicate('name').contains('Type');
  })
});
