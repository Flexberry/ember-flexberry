import Ember from 'ember';
import EditFormController from 'ember-flexberry/controllers/edit-form';
import { Query } from 'ember-flexberry-data';

const { StringPredicate } = Query;

export default EditFormController.extend({

  excludeFromSearchColumnsTest: [],

  modelFieldsForSettingExclusion: ['name', 'moderated'],

  /**
    Current predicate to limit accessible values for lookup.

    @property lookupCustomLimitPredicate
    @type BasePredicate
    @default undefined
   */
  lookupCustomLimitPredicate: Ember.computed('model.type', function() {
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
      let methodArgs = Ember.merge({
        projection: undefined,
        relationName: undefined
      }, options);

      if (methodArgs.relationName === 'type') {
        return {
          filterButton: true
        };
      }

      return undefined;
    },

    /**
      Chenge excludeFromSearchColumns.

      @method selectExcludeField
      @param {Object} items items chenge setting.
      @param {Object} value new prop value.
    */
    selectExcludeField(item, value) {
      let excludeFromSearchColumns = this.get('excludeFromSearchColumnsTest');
      if (value.checked) {
        let index = excludeFromSearchColumns.indexOf(item);
        if (index !== -1) {
          excludeFromSearchColumns.splice(index, 1);
        }
      } else {
        excludeFromSearchColumns.push(item);
      }
    }
  }
});
