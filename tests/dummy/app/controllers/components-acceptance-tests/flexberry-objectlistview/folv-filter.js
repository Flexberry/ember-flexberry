import ListFormController from 'ember-flexberry/controllers/list-form';

export default ListFormController.extend({

  /**
    Model projection for 'flexberry-objectlistview' component 'modelProjection' property.

    @property projection
    @type Object
   */
  projection: 'FlexberryObjectlistviewFilterTest',

  /**
    Name of related edit form route (for 'flexberry-objectlistview' component 'editFormRoute' property).

    @property editFormRoute
    @type String
   */
  editFormRoute: 'ember-flexberry-dummy-suggestion-edit',

  /**
    Flag: indicates whether 'flexberry-objectlistview' component is in 'enableFilters' mode or not.

    @property enableFilters
    @type Boolean
   */
  enableFilters: true,

  /**
    Flag: indicates whether 'flexberry-objectlistview' component is in 'refreshButton' mode or not.

    @property refreshButton
    @type Boolean
   */
  refreshButton: true,

  /**
    Flag: indicates whether 'flexberry-objectlistview' component is in 'showEditMenuItemInRow' mode or not.

    @property showEditMenuItemInRow
    @type Boolean
   */
  showEditMenuItemInRow: true,

  /**
    Flag: indicates whether 'flexberry-objectlistview' component is in 'rowClickable' mode or not.

    @property rowClickable
    @type Boolean
   */
  rowClickable: false,

  /**
    Flag: indicates whether 'flexberry-objectlistview' component is in 'orderable' mode or not.

    @property orderable
    @type Boolean
   */
  orderable: false,

  /**
    Flag to use colsConfigButton button at toolbar.

    @property colsConfigButton
    @type Boolean
  */
  colsConfigButton: false,

  /**
    Cout of list loading.

    @property loadCount
    @type Int
  */
  loadCount: 0,
});
