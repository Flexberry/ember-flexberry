import Ember from 'ember';
import ListFormController from 'ember-flexberry/controllers/list-form';
import { translationMacro as t } from 'ember-i18n';

export default ListFormController.extend({
  /**
    Name of selected detail's model projection.

    @property _projectionName
    @type String
    @private
   */
  _projectionName: 'SuggestionL',

  /**
    Array of available model projections.

    @property _projections
    @type Object[]
   */
  _projections: Ember.computed('model.[]', function() {
    let records = this.get('model');
    let modelClass = Ember.get(records, 'length') > 0 ? Ember.get(records, 'firstObject').constructor : {};

    return Ember.get(modelClass, 'projections');
  }),

  /**
    Array of available model projections names.

    @property _projectionsNames
    @type String[]
   */
  _projectionsNames: Ember.computed('_projections.[]', function() {
    let projections = this.get('_projections');
    if (Ember.isNone(projections)) {
      return [];
    }

    return Object.keys(projections);
  }),

  /**
    Model projection for 'flexberry-objectlistview' component 'modelProjection' property.

    @property projection
    @type Object
   */
  projection: Ember.computed('_projections.[]', '_projectionName', function() {
    let projectionName = this.get('_projectionName');
    if (Ember.isBlank(projectionName)) {
      return null;
    }

    let projections = this.get('_projections');
    if (Ember.isNone(projections)) {
      return null;
    }

    return projections[projectionName];
  }),

  /**
    Name of related edit form route (for 'flexberry-objectlistview' component 'editFormRoute' property).

    @property editFormRoute
    @type String
   */
  editFormRoute: 'ember-flexberry-dummy-suggestion-edit',

  /**
    Text for 'flexberry-objectlistview' component 'placeholder' property.

    @property placeholder
    @type String
   */
  placeholder: t('components.flexberry-objectlistview.placeholder'),
  /**
    Handles changes in placeholder.

    @method _placeholderChanged
    @private
  **/
  _placeholderChanged: Ember.observer('placeholder', function() {
    if (this.get('placeholder') === this.get('i18n').t('components.flexberry-objectlistview.placeholder').toString()) {
      this.set('placeholder', t('components.flexberry-objectlistview.placeholder'));
    }
  }),

  /**
    Flag: indicates whether 'flexberry-objectlistview' component is in 'readonly' mode or not.

    @property readonly
    @type Boolean
   */
  readonly: false,

  /**
    Flag for 'flexberry-objectlistview' component 'tableStriped' property.

    @property tableStriped
    @type Boolean
   */
  tableStriped: true,

  /**
    Flag for 'flexberry-objectlistview' component 'allowColumnResize' property.

    @property allowColumnResize
    @type Boolean
   */
  allowColumnResize: true,

  /**
    Flag: indicates whether 'flexberry-objectlistview' component is in 'createNewButton' mode or not.

    @property createNewButton
    @type Boolean
   */
  createNewButton: false,

  /**
    Flag for 'flexberry-objectlistview' component 'deleteButton' property.

    @property deleteButton
    @type Boolean
   */
  deleteButton: false,

  /**
    Flag: indicates whether 'flexberry-objectlistview' component is in 'enableFilters' mode or not.

    @property enableFilters
    @type Boolean
   */
  enableFilters: false,

  /**
    Flag: indicates whether 'flexberry-objectlistview' component is in 'filterButton' mode or not.

    @property filterButton
    @type Boolean
   */
  filterButton: false,

  /**
    Flag: indicates whether 'flexberry-objectlistview' component is in 'refreshButton' mode or not.

    @property refreshButton
    @type Boolean
   */
  refreshButton: false,

  /**
    Flag: indicates whether 'flexberry-objectlistview' component is in 'showCheckBoxInRow' mode or not.

    @property showCheckBoxInRow
    @type Boolean
   */
  showCheckBoxInRow: false,

  /**
    Flag: indicates whether 'flexberry-objectlistview' component is in 'showDeleteButtonInRow' mode or not.

    @property showDeleteButtonInRow
    @type Boolean
   */
  showDeleteButtonInRow: false,

  /**
    Flag: indicates whether 'flexberry-objectlistview' component is in 'showEditMenuItemInRow' mode or not.

    @property showEditMenuItemInRow
    @type Boolean
   */
  showEditMenuItemInRow: false,

  /**
    Flag: indicates whether 'flexberry-objectlistview' component is in 'showDeleteMenuItemInRow' mode or not.

    @property showDeleteMenuItemInRow
    @type Boolean
   */
  showDeleteMenuItemInRow: false,

  /**
    Flag: indicates whether 'flexberry-objectlistview' component is in 'rowClickable' mode or not.

    @property rowClickable
    @type Boolean
   */
  rowClickable: true,

  /**
    Flag: indicates whether 'flexberry-objectlistview' component is in 'orderable' mode or not.

    @property orderable
    @type Boolean
   */
  orderable: true,

  /**
    ext for 'flexberry-objectlistview' component 'singleColumnHeaderTitle' property.

    @property singleColumnHeaderTitle
    @type String
   */
  singleColumnHeaderTitle: undefined,

  /**
    Current records.

    @property _records
    @type Object[]
    @protected
    @readOnly
  */
  records: []
});
