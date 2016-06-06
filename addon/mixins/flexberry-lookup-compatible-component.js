/**
 * @module ember-flexberry
 */

import Ember from 'ember';

/**
 * Mixin for components which need to be flexberry-lookup compatible.
 *
 * @class FlexberryLookupCompatibleComponentMixin
 * @extends Ember.Mixin
 */
export default Ember.Mixin.create({
  actions: {
    showLookupDialog: function() {
      this.get('currentController').send('showLookupDialog', ...arguments);
    },

    removeLookupValue: function() {
      this.get('currentController').send('removeLookupValue', ...arguments);
    }
  }
});
