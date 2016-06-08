/**
  @module ember-flexberry
*/

import Ember from 'ember';
import FlexberryBaseComponent from './flexberry-base-component';

/**
  @class OlvToolbar
  @extends FlexberryBaseComponent
*/
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
    @type Service
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
  */
  filterByAnyMatchText: Ember.computed.oneWay('filterText'),

  actions: {
    /**
      Handles action from object-list-view when no handler for this component is defined.

      @method actions.refresh
      @public
    */
    refresh() {
      this.get('modelController').send('refreshList');
    },

    /**
      Handles action from object-list-view when no handler for this component is defined.

      @method actions.createNew
      @public
    */
    createNew() {
      let editFormRoute = this.get('editFormRoute');
      let modelController = this.get('modelController');
      modelController.transitionToRoute(editFormRoute + '.new');
    },

    /**
      Delete selected rows.

      @method actions.delete
      @public
    */
    delete() {
      let componentName = this.get('componentName');
      this.get('objectlistviewEventsService').deleteRowsTrigger(componentName, true);
    },

    /**
      Filters the content by "Filter by any match" field value.

      @method actions.filterByAnyMatch
      @public
    */
    filterByAnyMatch() {
      let componentName = this.get('componentName');
      this.get('objectlistviewEventsService').filterByAnyMatchTrigger(componentName, this.get('filterByAnyMatchText'));
    },

    /**
      Remove filter from url.

      @method actions.removeFilter
      @public
    */
    removeFilter() {
      this.set('filterText', null);
    },

    /**
      Action for custom button.

      @method actions.customButtonAction
      @public
      @param {String} actionName The name of action
    */
    customButtonAction(actionName) {
      this.sendAction('customButtonAction', actionName);
    }
  },

  /**
    An overridable method called when objects are instantiated.
    For more information see [init](http://emberjs.com/api/classes/Ember.View.html#method_init) method of [Ember.View](http://emberjs.com/api/classes/Ember.View.html).
   */
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
    Override to implement teardown.
    For more information see [willDestroy](http://emberjs.com/api/classes/Ember.Component.html#method_willDestroy) method of [Ember.Component](http://emberjs.com/api/classes/Ember.Component.html).
  */
  willDestroy() {
    this.get('objectlistviewEventsService').off('olvRowSelected', this, this._rowSelected);
    this.get('objectlistviewEventsService').off('olvRowsDeleted', this, this._rowsDeleted);
    this._super(...arguments);
  },

  /**
    Event handler for "row has been selected" event in objectlistview.

    @method _rowSelected
    @private

    @param {String} componentName The name of objectlistview component
    @param {DS.Model} record The model corresponding to selected row in objectlistview
    @param {Number} count Count of selected rows in objectlistview
  */
  _rowSelected(componentName, record, count) {
    if (componentName === this.get('componentName')) {
      this.set('isDeleteButtonEnabled', count > 0 && this.get('enableDeleteButton'));
    }
  }
});
