import { computed } from '@ember/object';
import EditFormController from 'ember-flexberry/controllers/edit-form';
import { SimplePredicate } from 'ember-flexberry-data/query/predicate';
import FilterOperator from 'ember-flexberry-data/query/filter-operator';

export default EditFormController.extend({

  /**
    Current predicate to limit values for lookup.

    @property limitValue
    @type BasePredicate
    @default undefined
   */
  limitValue: undefined,

  /**
    Current values for lookup.

    @property limitValue
    @type BasePredicate
    @default undefined
   */
  defaultValue: undefined,

  /**
    Current predicate to limit accessible values for lookup.

    @property lookupCustomLimitPredicate
    @type BasePredicate
    @default undefined
   */
  lookupCustomLimitPredicate: computed(function() {
    let limitValue = this.get('limitValue');

    return new SimplePredicate('id', FilterOperator.Eq, limitValue.get('id'));
  })
});
