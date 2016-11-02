/**
  @module ember-flexberry
*/

import Ember from 'ember';

/**
  Service for triggering lookup events.

  @class LookupEvents
  @extends Ember.Service
  @uses Ember.Evented
  @public
*/
export default Ember.Service.extend(Ember.Evented, {
  /**
    Trigger for "modal is show" event in flexberry-lookup.

    @method showDialogTrigger
    @param {Boolean} modalIsShow Flag modal dialog open or not.
  */
  showDialogTrigger(modalIsShow) {
    this.trigger('setModalIsShow', modalIsShow);
  }
});
