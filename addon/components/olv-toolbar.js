/**
 * @module ember-flexberry
 */

import Ember from 'ember';

export default Ember.Component.extend({
  modelName: null,
  modelController:null,

  /**
   * Service that triggers objectlistview events.
   *
   * @property objectlistviewEventsService
   * @type ObjectlistviewEvents
   */
  objectlistviewEventsService: Ember.inject.service('objectlistview-events'),

  /**
   * Flag to use creation button at toolbar.
   *
   * @property createNewButton
   * @type Boolean
   * @default false
   */
  createNewButton: false,

  /**
   * Flag to use refresh button at toolbar.
   *
   * @property refreshButton
   * @type Boolean
   * @default false
   */
  refreshButton: false,

  /**
   * Flag to use delete button at toolbar.
   *
   * @property deleteButton
   * @type Boolean
   * @default false
   */
  deleteButton: false,

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

    var componentName = this.get('componentName');
    if (this.get('deleteButton') === true && !componentName) {
      throw new Error('Name of flexberry-objectlictview component was not defined.');
    }

    this.get('objectlistviewEventsService').on('olvRowSelected', this, this._rowSelected);
    this.get('objectlistviewEventsService').on('olvRowsDeleted', this, this._rowsDeleted);

    let customButton = this.get('customButtonsClosureEvent');
    if (customButton && typeof (customButton) === 'function') {
      let customButtonsResult = customButton();
      this.set('customButtonsArray', customButtonsResult);
    }
  },

  /**
   * Implementation of component's teardown.
   *
   * @method willDestroy
   */
  willDestroy() {
    this.get('objectlistviewEventsService').off('olvRowSelected', this, this._rowSelected);
    this.get('objectlistviewEventsService').off('olvRowsDeleted', this, this._rowsDeleted);
    this._super(...arguments);
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

    /**
     * Delete selected rows.
     *
     * @method delete
     */
    delete: function() {
      var componentName = this.get('componentName');
      this.get('objectlistviewEventsService').deleteRowsTrigger(componentName, true);
    },
    customButtonAction: function(actionName) {
      this.sendAction('customButtonAction', actionName);
    }
  },

  /**
   * Flag shows enable-state of delete button.
   * If there are selected rows button is enabled. Otherwise - not.
   *
   * @property isDeleteButtonEnabled
   * @type Boolean
   * @default false
   */
  isDeleteButtonEnabled: false,

  /**
   * Event handler for "row has been selected" event in objectlistview.
   *
   * @method _rowSelected
   * @private
   *
   * @param {String} componentName The name of objectlistview component.
   * @param {Model} record The model corresponding to selected row in objectlistview.
   * @param {Integer} count Count of selected rows in objectlistview.
   */
  _rowSelected: function(componentName, record, count) {
    if (componentName === this.get('componentName')) {
      this.set('isDeleteRowsEnabled', count > 0);
    }
  }
});
