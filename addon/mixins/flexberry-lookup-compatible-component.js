/**
  @module ember-flexberry
 */

import Ember from 'ember';

/**
  Mixin for components which need to be FlexberryLookup compatible.

  @class FlexberryLookupCompatibleComponent
  @uses <a href="http://emberjs.com/api/classes/Ember.Mixin.html">Ember.Mixin</a>
 */
export default Ember.Mixin.create({
  actions: {
    /**
      Open modal window for select value.

      @method actions.showLookupDialog
     */
    showLookupDialog() {
      this.get('currentController').send('showLookupDialog', ...arguments);
    },

    /**
      Clear selected value.

      @method actions.removeLookupValue
     */
    removeLookupValue() {
      this.get('currentController').send('removeLookupValue', ...arguments);
    },

    /**
      View selected value.

      @method actions.previewLookupValue
     */
    previewLookupValue() {
      this.get('currentController').send('previewLookupValue', ...arguments);
    },
  },
});
