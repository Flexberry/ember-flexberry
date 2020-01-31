/**
  @module ember-flexberry
 */

import Mixin from '@ember/object/mixin';

/**
  Mixin for components which need to be FlexberryLookup compatible.

  @class FlexberryLookupCompatibleComponent
  @uses <a href="https://www.emberjs.com/api/ember/release/classes/Mixin">Mixin</a>
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

    /**
      View selected value.

      @method actions.previewLookupValue
     */
    previewLookupValue() {
      this.get('currentController').send('previewLookupValue', ...arguments);
    },
  },
});
