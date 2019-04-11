import Ember from 'ember';
import EditFormController from 'ember-flexberry/controllers/edit-form';
import { Query } from 'ember-flexberry-data';

const { SimplePredicate, FilterOperator } = Query;

export default EditFormController.extend({

  /**
    Current predicate to limit values for lookup.

    @property limitValue
    @type BasePredicate
    @default undefined
   */
  limitValue: undefined,

  /**
    Current predicate to limit accessible values for lookup.

    @property lookupCustomLimitPredicate
    @type BasePredicate
    @default undefined
   */
  lookupCustomLimitPredicate: Ember.computed(function() {
    let limitValue = this.get('limitValue');

    return new SimplePredicate('id', FilterOperator.Eq, limitValue.get('id'));
  })
});
