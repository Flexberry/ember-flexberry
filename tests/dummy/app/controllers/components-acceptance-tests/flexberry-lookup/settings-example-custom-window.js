import EditFormController from 'ember-flexberry/controllers/edit-form';
import Ember from 'ember';

export default EditFormController.extend({
  filterProjectionName: undefined,
  projectionName: 'ApplicationUserL',

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
  
      if (methodArgs.relationName === 'editor1') {
        return {
          filterButton: true,
          filterProjectionName: Ember.get(this, 'filterProjectionName')
        };
      }
  
      return undefined;
    },

    /**
      This method returns custom properties for lookup window.
      @method getLookupFolvPropertiesForAuthor

      @param {Object} options Parameters of lookup that called this method.
      @param {String} [options.projection] Lookup projection.
      @param {String} [options.relationName] Lookup relation name.
      @return {Object} Set of options for lookup window.
     */
    getLookupFolvPropertiesForAuthor: function(options) {
      let methodArgs = Ember.merge({
        projection: undefined,
        relationName: undefined
      }, options);
  
      if (methodArgs.relationName === 'author') {
        return {
          filterButton: true
        };
      }
  
      return undefined;
    }
  }
});
