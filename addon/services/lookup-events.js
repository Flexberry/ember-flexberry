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
  showDialogTrigger(modalIsShow) {
    this.trigger('setModalIsShow', modalIsShow);
  }
});
