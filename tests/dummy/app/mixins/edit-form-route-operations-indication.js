/**
  @module ember-flexberry-dummy
*/

import Ember from 'ember';

/**
  Edit forms routes mixin which handles save/delete operations indication.

  @class EditFormRouteOperationsIndicationMixin
*/
export default Ember.Mixin.create({
  /**
    Resets routes controller, clears save/delete operations messages.
  */
  resetController: function(controller, isExisting, transition) {
    this._super.apply(this, arguments);

    controller.set('showFormSuccessMessage', false);
    controller.set('showFormErrorMessage', false);
  }
});
