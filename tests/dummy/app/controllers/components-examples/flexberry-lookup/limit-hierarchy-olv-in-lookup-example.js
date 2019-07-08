import Ember from 'ember';
import EditFormController from 'ember-flexberry/controllers/edit-form';
import { Query } from 'ember-flexberry-data';

const { StringPredicate } = Query;

export default EditFormController.extend({
  /**
    Current predicate to limit accessible values for lookup.

    @property lookupHierarchyLimitPredicate
    @type BasePredicate
    @default undefined
   */
  lookupHierarchyLimitPredicate: Ember.computed('model.type', function() {
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
        relationName: undefined,
        componentName: undefined
      }, options);

      if (methodArgs.relationName === 'type') {
        return {
          modelName: 'ember-flexberry-dummy-suggestion-type',
          modelProjection: 'SettingLookupExampleView',
          hierarchicalAttribute: 'parent'
        };
      }

      return undefined;
    },
  }
});
