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
    Trigger is called when a modal starts to show.

    @method lookupDialogOnShowTrigger
    @param {String} componentName Name of flexberry-lookup component.
  */
  lookupDialogOnShowTrigger(componentName) {
    this.trigger('lookupDialogOnShow', componentName);
  },

  /**
    Trigger is called after a modal has finished showing.

    @method lookupDialogOnVisibleTrigger

    @param {String} componentName Name of flexberry-lookup component.
    @param {Object} lookupDialog Context for this lookup dialog.
  */
  lookupDialogOnVisibleTrigger(componentName, lookupDialog) {
    this.trigger('lookupDialogOnVisible', componentName, lookupDialog);
  },

  /**
    Trigger is called after a modal has finished hiding.

    @method lookupDialogOnHiddenTrigger
    @param {String} componentName Name of flexberry-lookup component.
  */
  lookupDialogOnHiddenTrigger(componentName) {
    this.trigger('lookupDialogOnHidden', componentName);
  },

  /**
    Called when lookup value changed.

    @method lookupOnChangeTrigger
    @param {String} componentName Name of flexberry-lookup component.
    @param {Model} newValue New lookup value.
  */
  lookupOnChangeTrigger(componentName, newValue) {
    this.trigger('lookupOnChange', componentName, newValue);
  },
});
