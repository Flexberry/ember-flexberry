/**
 * @module ember-flexberry
 */

import FlexberryBaseComponent from './flexberry-base-component';

/**
 * Component for create, edit and delete detail objects.
 *
 * @class FlexberryGroupedit
 * @extends FlexberryBaseComponent
 */
export default FlexberryBaseComponent.extend({
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
   * Function to get names of components to use for display
   * attributes of detail object's model.
   *
   * @property cellComponent
   * @type Function
   * @default null
   */
  cellComponent: null,

  /**
   * Flag to allow row click.
   *
   * @property rowClickable
   * @type Boolean
   * @default false
   */
  rowClickable: false,

  /**
   * Name of action to handle row click.
   * Action will be send out of the component.
   *
   * @property rowClick
   * @type String
   * @default 'rowClick'
   */
  rowClick: 'rowClick',

  /**
   * Setting to true enables row ordering by clicking on column headers.
   *
   * @property orderable
   * @type Boolean
   * @default false
   */
  orderable: false,
  _showCheckBoxInRow: true,
  _showDeleteButtonInRow: true,

  actions: {
    /**
     * Handles action from object-list-view when no handler for this component is defined.
     *
     * @method sortByColumn
     * @param {Object} column Column to sort by.
     */
    sortByColumn: function(column) {
      throw new Error('No handler for sortByColumn action set for flexberry-groupedit. ' +
                      'Set handler like {{flexberry-groupedit ... sortByColumn=(action "sortByColumn")}}.');
    },

    /**
     * Handles action from object-list-view when no handler for this component is defined.
     *
     * @method addColumnToSorting
     * @param {Object} column Column to add sorting by.
     */
    addColumnToSorting: function(column) {
      throw new Error('No handler for addColumnToSorting action set for flexberry-groupedit. ' +
                      'Set handler like {{flexberry-groupedit ... addColumnToSorting=(action "addColumnToSorting")}}.');
    },

    /**
     * Handles click on row of objectlistview.
	 * Sends action out of component.
     *
     * @method rowClick
     * @param {Object} record Clicked record.
     */
    rowClick: function(record) {
      this.sendAction('rowClick', record);
    }
  }
});
