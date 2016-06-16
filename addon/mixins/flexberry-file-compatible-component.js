/**
  @module ember-flexberry
 */

import Ember from 'ember';

/**
  Mixin for components which need to be flexberry-file compatible.

  @class FlexberryFileCompatibleComponentMixin
  @extends <a href="http://emberjs.com/api/classes/Ember.Mixin.html">Ember.Mixin</a>
 */
export default Ember.Mixin.create({
  actions: {
    flexberryFileViewImageAction: function() {
      this.get('currentController').send('flexberryFileViewImageAction', ...arguments);
    }
  }
});
