import { merge } from '@ember/polyfills';
import { computed } from '@ember/object';
import EditFormController from 'ember-flexberry/controllers/edit-form';
import { StringPredicate } from 'ember-flexberry-data/query/predicate';

export default EditFormController.extend({
  /**
    Current predicate to limit accessible values for lookup.

    @property lookupCustomLimitPredicate
    @type BasePredicate
    @default undefined
   */
  lookupCustomLimitPredicate: computed('model.type', function() {
    let currentLookupValue = this.get('model.type');
    if (currentLookupValue) {
      let currentLookupText = this.get('model.type.name');
      return new StringPredicate('name').contains(currentLookupText);
    }

    return undefined;
  }),

  actions: {
    /**
      This method returns custom properties for lookup window.

      @method getLookupFolvProperties
      @param {Object} options Parameters of lookup that called this method.
      @param {String} [options.projection] Lookup projection.
      @param {String} [options.relationName] Lookup relation name.
      @return {Object} Set of options for lookup window.
     */
    getLookupFolvProperties: function(options) {
      let methodArgs = merge({
        projection: undefined,
        relationName: undefined
      }, options);

      if (methodArgs.relationName === 'type') {
        return {
          filterButton: true
        };
      }

      return undefined;
    }
  }
});
