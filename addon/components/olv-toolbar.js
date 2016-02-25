/**
 * @module ember-flexberry
 */

import Ember from 'ember';

export default Ember.Component.extend({
  modelName: null,
  modelController:null,
  createNewButton: false,
  refreshButton: false,

  /**
   * Name of action to send out, action triggered by click on user button.
   *
   * @property customButtonAction
   * @type String
   * @default 'customButtonAction'
   */
  customButtonAction: 'customButtonAction',

  /**
   * Handler to get custom buttons from controller.
   * It has to be closure event and return array of special structures [{ buttonName: ..., buttonAction: ..., buttonClasses: ... }, {...}, ...].
   *
   * @property customButtonsClosureEvent
   * @type Function
   * @default undefined
   */
  customButtonsClosureEvent: undefined,

  /**
   * Array of custom buttons.
   *
   * @property customButtonsArray
   * @type Array
   * @default undefined
   */
  customButtonsArray: undefined,

  init: function() {
    this._super(...arguments);
    let customButton = this.get('customButtonsClosureEvent');
    if (customButton && typeof (customButton) === 'function') {
      let customButtonsResult = customButton();
      this.set('customButtonsArray', customButtonsResult);
    }
  },

  actions: {
    refresh: function() {
      this.get('modelController').send('refreshList');
    },
    createNew: function() {
      let modelController = this.get('modelController');
      let modelName = this.get('modelName');
      modelController.transitionToRoute(modelName + '.new');
    },
    customButtonAction: function(actionName) {
      this.sendAction('customButtonAction', actionName);
    }
  }
});
