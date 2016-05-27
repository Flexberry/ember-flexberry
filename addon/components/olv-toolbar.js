/**
  @module ember-flexberry
*/

import Ember from 'ember';
import FlexberryBaseComponent from './flexberry-base-component';

export default FlexberryBaseComponent.extend({
  modelController: null,

  /**
    Route for edit form by click row.

    @property editFormRoute
    @type String
  */
  editFormRoute: undefined,

  /**
    Service that triggers objectlistview events.

    @property objectlistviewEventsService
    @type ObjectlistviewEvents
  */
  objectlistviewEventsService: Ember.inject.service('objectlistview-events'),

  /**
    Flag to use creation button at toolbar.

    @property createNewButton
    @type Boolean
    @default false
  */
  createNewButton: false,

  /**
    Flag to specify whether the create button is enabled.

    @property enableCreateNewButton
    @type Boolean
    @default true
  */
  enableCreateNewButton: true,

  /**
    Flag to use refresh button at toolbar.

    @property refreshButton
    @type Boolean
    @default false
  */
  refreshButton: false,

  /**
    Flag to use delete button at toolbar.

    @property deleteButton
    @type Boolean
    @default false
  */
  deleteButton: false,

  /**
    Flag to use filter button at toolbar.

    @property filterButton
    @type Boolean
    @default false
  */
  filterButton: false,

  /**
    Used to specify default 'filter by any match' field text.

    @property filterText
    @type String
    @default null
  */
  filterText: null,

  /**
    The flag to specify whether the delete button is enabled.

    @property enableDeleteButton
    @type Boolean
    @default true
  */
  enableDeleteButton: true,

  /**
    Name of action to send out, action triggered by click on user button.

    @property customButtonAction
    @type String
    @default 'customButtonAction'
  */
  customButtonAction: 'customButtonAction',

  /**
    Handler to get custom buttons from controller.
    It has to be closure event and return array of special structures [{ buttonName: ..., buttonAction: ..., buttonClasses: ... }, {...}, ...].

    @property customButtonsClosureEvent
    @type Function
  */
  customButtonsClosureEvent: undefined,

  /**
    Array of custom buttons.

    @property customButtonsArray
    @type Array
  */
  customButtonsArray: undefined,

  init() {
    this._super(...arguments);

    let componentName = this.get('componentName');
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
    Implementation of component's teardown.

    @method willDestroy
  */
  willDestroy() {
    this.get('objectlistviewEventsService').off('olvRowSelected', this, this._rowSelected);
    this.get('objectlistviewEventsService').off('olvRowsDeleted', this, this._rowsDeleted);
    this._super(...arguments);
  },

  actions: {
    refresh() {
      this.get('modelController').send('refreshList');
    },
    createNew() {
      let editFormRoute = this.get('editFormRoute');
      let modelController = this.get('modelController');
      modelController.transitionToRoute(editFormRoute + '.new');
    },

    /**
      Delete selected rows.

      @method delete
    */
    delete() {
      let componentName = this.get('componentName');
      this.get('objectlistviewEventsService').deleteRowsTrigger(componentName, true);
    },

    /**
      Filters the content by "Filter by any match" field value.

      @method filterByAnyMatch
    */
    filterByAnyMatch() {
      let componentName = this.get('componentName');
      this.get('objectlistviewEventsService').filterByAnyMatchTrigger(componentName, this.get('filterByAnyMatchText'));
    },

    /**
      Remove filter from url.

      @method removeFilter
      @public
    */
    removeFilter() {
      this.set('filterText', null);
    },

    customButtonAction(actionName) {
      this.sendAction('customButtonAction', actionName);
    }
  },

  /**
    Flag shows enable-state of delete button.
    If there are selected rows button is enabled. Otherwise - not.

    @property isDeleteButtonEnabled
    @type Boolean
    @default false
  */
  isDeleteButtonEnabled: false,

  /**
    Stores the text from "Filter by any match" input field.

    @property filterByAnyMatchText
    @type String
    @default null
  */
  filterByAnyMatchText: Ember.computed.oneWay('filterText'),

  /**
    Event handler for "row has been selected" event in objectlistview.

    @method _rowSelected
    @private

    @param {String} componentName The name of objectlistview component
    @param {Model} record The model corresponding to selected row in objectlistview
    @param {Number} count Count of selected rows in objectlistview
  */
  _rowSelected(componentName, record, count) {
    if (componentName === this.get('componentName')) {
      this.set('isDeleteButtonEnabled', count > 0 && this.get('enableDeleteButton'));
    }
  }
});
