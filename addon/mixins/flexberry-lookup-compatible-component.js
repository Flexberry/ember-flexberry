/**
  @module ember-flexberry
 */

import Mixin from '@ember/object/mixin';

/**
  Mixin for components which need to be FlexberryLookup compatible.

  @class FlexberryLookupCompatibleComponent
  @uses <a href="http://emberjs.com/api/classes/Ember.Mixin.html">Ember.Mixin</a>
 */
export default Mixin.create({
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
  },
});
