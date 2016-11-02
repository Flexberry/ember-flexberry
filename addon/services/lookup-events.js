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
  },

  /**
    Trigger is called when a modal starts to show.

    @method lookupDialogOnShowTrigger
  */
  lookupDialogOnShowTrigger() {
    this.trigger('lookupDialogOnShow');
  },

  /**
    Trigger is called after a modal has finished showing.

    @method lookupDialogOnVisibleTrigger
    @param {Object} lookupDialog Context for this lookup dialog.
  */
  lookupDialogOnVisibleTrigger(lookupDialog) {
    this.trigger('lookupDialogOnVisible', lookupDialog);
  },

  /**
    Trigger is called after a modal has finished hiding.

    @method lookupDialogOnHiddenTrigger
  */
  lookupDialogOnHiddenTrigger() {
    this.trigger('lookupDialogOnHidden');
  }
});
