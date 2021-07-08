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
