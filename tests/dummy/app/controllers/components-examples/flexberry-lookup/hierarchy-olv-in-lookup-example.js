import { merge } from '@ember/polyfills';
import EditFormController from 'ember-flexberry/controllers/edit-form';

export default EditFormController.extend({
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
        relationName: undefined,
        componentName: undefined
      }, options);

      if (methodArgs.relationName === 'type') {
        if (methodArgs.componentName === 'HierarchyLookup') {
          return {
            modelName: 'ember-flexberry-dummy-suggestion-type',
            modelProjection: 'SettingLookupExampleView',
            inHierarchicalMode: true,
            hierarchicalAttribute: 'parent'
          };
        }

        if (methodArgs.componentName === 'NoHierarchyLookup') {
          return {
            modelName: 'ember-flexberry-dummy-suggestion-type',
            modelProjection: 'SettingLookupExampleView',
            inHierarchicalMode: false,
            hierarchicalAttribute: 'parent'
          };
        }

        if (methodArgs.componentName === 'DisabledHierarchyLookup') {
          return {
            disableHierarchicalMode: true,
            modelName: 'ember-flexberry-dummy-suggestion-type',
            modelProjection: 'SettingLookupExampleView',
            inHierarchicalMode: false,
            hierarchicalAttribute: 'parent'
          };
        }
      }

      return undefined;
    },
  }
});
