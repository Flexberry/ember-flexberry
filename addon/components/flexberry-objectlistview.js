/**
 * @module ember-flexberry
 */

import FlexberryBaseComponent from './flexberry-base-component';

/**
 * Component to view list of object.
 *
 * @class FlexberryObjectlistview
 * @extends FlexberryBaseComponent
 */
export default FlexberryBaseComponent.extend({
  /**
   * Primary action for row click.
   *
   * @property action
   * @type String
   * @default 'rowClick'
   */
  action: 'rowClick',

  /**
   * Model's name. Used by toolbar.
   *
   * @property modelName
   * @type String
   * @default null
   */
  modelName: null,

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
   * Projection for detail object's model.
   *
   * @property modelProjection
   * @type Object
   * @default null
   */
  modelProjection: null,

  /**
   * Array of models for detail objects.
   *
   * @property content
   * @type ManyArray
   * @default null
   */
  content: null,

  /**
   * Current sort order.
   *
   * @property sorting
   * @type Object
   * @default null
   */
  sorting: null,

  /**
   * Array of pages to show.
   *
   * @property pages
   * @type ManyArray
   * @default null
   */
  pages: null,

  /**
   * Current number of records to show per page.
   *
   * @property perPageValue
   * @type number
   * @default null
   */
  perPageValue: null,

  /**
   * Array of numbers of records to show on one page.
   *
   * @property perPageValues
   * @type ManyArray
   * @default null
   */
  perPageValues: null,

  /**
   * Function to determine if current page has previous page.
   *
   * @property hasPreviousPage
   * @type Function
   * @default null
   */
  hasPreviousPage: null,

  /**
   * Function to determine if current page has next page.
   *
   * @property hasNextPage
   * @type Function
   * @default null
   */
  hasNextPage: null,

  /**
   * Setting to true enables row ordering by clicking on column headers.
   *
   * @property orderable
   * @type Boolean
   * @default false
   */
  orderable: false,

  /**
   * Flag to allow row click.
   *
   * @property rowClickable
   * @type Boolean
   * @default true
   */
  rowClickable: true,

  /**
   * Flag to show checkboxes in row.
   *
   * @property showCheckBoxInRow
   * @type Boolean
   * @default false
   */
  _showCheckBoxInRow: false,

  /**
   * Flag to show delete button in row.
   *
   * @property showDeleteButtonInRow
   * @type Boolean
   * @default false
   */
  _showDeleteButtonInRow: false,

  actions: {
    /**
     * Handles action from object-list-view when no handler for this component is defined.
     *
     * @method sortByColumn
     * @param {Object} column Column to sort by.
     */
    sortByColumn: function(column) {
      throw new Error('No handler for sortByColumn action set for flexberry-objectlistview. ' +
                      'Set handler like {{flexberry-objectlistview ... sortByColumn=(action "sortByColumn")}}.');
    },

    /**
     * Handles action from object-list-view when no handler for this component is defined.
     *
     * @method addColumnToSorting
     * @param {Object} column Column to add sorting by.
     */
    addColumnToSorting: function(column) {
      throw new Error('No handler for addColumnToSorting action set for flexberry-objectlistview. ' +
                      'Set handler like {{flexberry-objectlistview ... addColumnToSorting=(action "addColumnToSorting")}}.');
    },

    /**
     * Handles action from row click (action is handled at route so it can't be closure action now).
     *
     * @method rowClick
     * @param {Object} record Clicked record.
     */
    rowClick: function(record) {
      this.sendAction('action', record);
    },

    /**
     * Handles action from object-list-view when no handler for this component is defined.
     *
     * @method previousPage
     */
    previousPage: function() {
      throw new Error('No handler for previousPage action set for flexberry-objectlistview. ' +
                      'Set handler like {{flexberry-objectlistview ... previousPage=(action "previousPage")}}.');
    },

    /**
     * Handles action from object-list-view when no handler for this component is defined.
     *
     * @method nextPage
     */
    nextPage: function() {
      throw new Error('No handler for nextPage action set for flexberry-objectlistview. ' +
                      'Set handler like {{flexberry-objectlistview ... nextPage=(action "nextPage")}}.');
    },

    /**
     * Handles action from object-list-view when no handler for this component is defined.
     *
     * @method gotoPage
     * @param {number} pageNumber Number of page to go to
     */
    gotoPage: function(pageNumber) {
      throw new Error('No handler for gotoPage action set for flexberry-objectlistview. ' +
                      'Set handler like {{flexberry-objectlistview ... gotoPage=(action "gotoPage")}}.');
    },

    /**
     * A stub for call of custom user buttons. Used when no handler is defined.
     *
     * @method customButtons
	 * @return {Array} Returns only 'undefined' (because is's a stub).
     */
    customButtons: function() {
      return undefined;
    },

    /**
     * Handler to get user button's actions and send action to corresponding controllers's handler.
     *
     * @method customButtonAction
     */
    customButtonAction: function(actionName) {
      if (!actionName) {
        throw new Error('No handler for custom button of flexberry-objectlistview toolbar was found.');
      }

      this.sendAction(actionName);
    }
  }
});
