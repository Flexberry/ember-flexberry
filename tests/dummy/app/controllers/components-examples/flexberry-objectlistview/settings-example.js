import { isBlank, isNone } from '@ember/utils';
import { get, computed, observer } from '@ember/object';
import { A } from '@ember/array';
import { htmlSafe } from '@ember/string';
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
  _projections: computed('model.[]', function() {
    let records = this.get('model');
    let modelClass = get(records, 'length') > 0 ? get(records, 'firstObject').constructor : {};

    return get(modelClass, 'projections');
  }),

  /**
    Array of available model projections names.

    @property _projectionsNames
    @type String[]
   */
  _projectionsNames: computed('_projections.[]', function() {
    let projections = this.get('_projections');
    if (isNone(projections)) {
      return [];
    }

    return Object.keys(projections);
  }),

  /**
    Model projection for 'flexberry-objectlistview' component 'modelProjection' property.

    @property projection
    @type Object
   */
  projection: computed('_projections.[]', '_projectionName', function() {
    let projectionName = this.get('_projectionName');
    if (isBlank(projectionName)) {
      return null;
    }

    let projections = this.get('_projections');
    if ((isNone(projections)) && (this.get('model.content') === undefined)) {
      return {}; // модель не загрузилась ещё, свойство пересчитывается, потому что грузится страница.
    }

    if (isNone(projections)) {
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
  _placeholderChanged: observer('placeholder', function() {
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
    Flag for 'flexberry-objectlistview' component 'colsConfigButton' property.

    @property colsConfigButton
    @type Boolean
   */
  colsConfigButton: true,

  /**
    Flag for 'flexberry-objectlistview' component 'exportExcelButton' property.

    @property exportExcelButton
    @type Boolean
   */
  exportExcelButton: false,

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
    Flag: indicates whether 'flexberry-objectlistview' component is in 'showFiltersInModal' mode or not.

    @property showFiltersInModal
    @type Boolean
    @default false
  */
  showFiltersInModal: false,

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
    Flag: indicates whether 'flexberry-objectlistview' component is in 'defaultSortingButton' mode or not

    @property defaultSortingButton
    @type Boolean
    @default true
  */
  defaultSortingButton: true,

  /**
    Flag: indicates whether 'flexberry-objectlistview' component is in 'showCheckBoxInRow' mode or not.

    @property showCheckBoxInRow
    @type Boolean
   */
  showCheckBoxInRow: true,

  /**
    Flag: indicates whether 'flexberry-objectlistview' component is in 'showDeleteButtonInRow' mode or not.

    @property showDeleteButtonInRow
    @type Boolean
   */
  showDeleteButtonInRow: false,

  /**
    Flag: indicates whether 'flexberry-objectlistview' component is in 'showEditButtonInRow' mode or not.

    @property showEditButtonInRow
    @type Boolean
   */
  showEditButtonInRow: false,

  /**
    Flag: indicates whether 'flexberry-objectlistview' component is in 'showPrototypeButtonInRow' mode or not.

    @property showPrototypeButtonInRow
    @type Boolean
   */
  showPrototypeButtonInRow: false,

  /**
    Flag: indicates whether 'flexberry-objectlistview' component is in 'showDeleteMenuItemInRow' mode or not.

    @property showDeleteMenuItemInRow
    @type Boolean
   */
  showDeleteMenuItemInRow: true,

  /**
    Flag: indicates whether 'flexberry-objectlistview' component is in 'showPrototypeMenuItemInRow' mode or not.

    @property showPrototypeMenuItemInRow
    @type Boolean
   */
  showPrototypeMenuItemInRow: true,

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
    'Flexberry-objectlistview' component's 'minAutoColumnWidth' property.

    @property minAutoColumnWidth
    @type Number
   */
  minAutoColumnWidth: 150,

  /**
    Flag for 'flexberry-objectlistview' component 'columnsWidthAutoresize' property.

    @property columnsWidthAutoresize
    @type Boolean
   */
  columnsWidthAutoresize: false,

  /**
    Flag indicate when available the hierarchical mode.

    @property availableHierarchicalMode
    @type Boolean
    @default false
    @private
  */
  availableHierarchicalMode: false,

  /**
    Flag indicate when available the collapse/expand all hierarchies mode.

    @property availableCollExpandMode
    @type Boolean
    @default false
    @private
  */
  availableCollExpandMode: false,

  /**
    Flag for 'flexberry-objectlistview' component 'fixedHeader' property.

    @property fixedHeader
    @type Boolean
   */
  fixedHeader: false,

  /**
    Flag for 'flexberry-objectlistview' component 'advLimitButton' property.

    @property fixedHeader
    @type Boolean
   */
  advLimitButton: false,

  /**
    Flag indicate when edit form must be open in modal window.

    @property editInModal
    @type Boolean
  */
    editInModal: false,

  /**
    Current records.

    @property _records
    @type Object[]
    @protected
    @readOnly
  */
  records: undefined,

  /**
    Template text for 'flexberry-objectlistview' component.

    @property componentTemplateText
    @type String
   */
  componentTemplateText: undefined,

  init() {
    this._super(...arguments);
    this.set('records', []);
    this.set('componentTemplateText', new htmlSafe(
      '{{flexberry-objectlistview<br>' +
      '  componentName="SuggestionsObjectListView"<br>' +
      '  colsConfigButton=colsConfigButton<br>' +
      '  exportExcelButton=exportExcelButton<br>' +
      '  content=model<br>' +
      '  modelName="ember-flexberry-dummy-suggestion"<br>' +
      '  editFormRoute="ember-flexberry-dummy-suggestion"<br>' +
      '  modelProjection=projection<br>' +
      '  placeholder=placeholder<br>' +
      '  readonly=readonly<br>' +
      '  tableStriped=tableStriped<br>' +
      '  allowColumnResize=allowColumnResize<br>' +
      '  minAutoColumnWidth=minAutoColumnWidth<br>' +
      '  columnsWidthAutoresize=columnsWidthAutoresize<br>' +
      '  createNewButton=createNewButton<br>' +
      '  deleteButton=deleteButton<br>' +
      '  showFiltersInModal=showFiltersInModal<br>' +
      '  enableFilters=enableFilters<br>' +
      '  filters=filters<br>' +
      '  applyFilters=(action "applyFilters")<br>' +
      '  resetFilters=(action "resetFilters")<br>' +
      '  refreshButton=refreshButton<br>' +
      '  defaultSortingButton=defaultSortingButton<br>' +
      '  filterButton=filterButton<br>' +
      '  showCheckBoxInRow=showCheckBoxInRow<br>' +
      '  showEditButtonInRow=showEditButtonInRow<br>' +
      '  showPrototypeButtonInRow=showPrototypeButtonInRow<br>' +
      '  showDeleteButtonInRow=showDeleteButtonInRow<br>' +
      '  showEditMenuItemInRow=showEditMenuItemInRow<br>' +
      '  showPrototypeMenuItemInRow=showPrototypeMenuItemInRow<br>' +
      '  showDeleteMenuItemInRow=showDeleteMenuItemInRow<br>' +
      '  rowClickable=rowClickable<br>' +
      '  orderable=orderable<br>' +
      '  filterByAnyMatch=(action "filterByAnyMatch")<br>' +
      '  filterText=filter<br>' +
      '  filterByAnyWord=filterByAnyWord<br>' +
      '  filterByAllWords=filterByAllWords<br>' +
      '  sorting=computedSorting<br>' +
      '  sortByColumn=(action "sortByColumn")<br>' +
      '  addColumnToSorting=(action "addColumnToSorting")<br>' +
      '  _availableHierarchicalMode=availableHierarchicalMode<br>' +
      '  availableCollExpandMode=availableCollExpandMode<br>' +
      '  pages=pages<br>' +
      '  perPageValue=perPageValue<br>' +
      '  perPageValues=perPageValues<br>' +
      '  hasPreviousPage=hasPreviousPage<br>' +
      '  hasNextPage=hasNextPage<br>' +
      '  previousPage=(action "previousPage")<br>' +
      '  gotoPage=(action "gotoPage")<br>' +
      '  nextPage=(action "nextPage")<br>' +
      '  fixedHeader=fixedHeader<br>' +
      '  advLimitButton=advLimitButton<br>' +
      '  editInModal=editInModal<br>' +
      '}}'));
  },

  /**
    Component settings metadata.

    @property componentSettingsMetadata
    @type Object[]
   */
  componentSettingsMetadata: computed('i18n.locale', 'model.content', function() {
    let componentSettingsMetadata = A();

    componentSettingsMetadata.pushObject({
      settingName: 'componentName',
      settingType: 'string',
      settingValue: 'SuggestionsObjectListView',
      settingDefaultValue: undefined,
      settingIsWithoutUI: true
    });
    componentSettingsMetadata.pushObject({
      settingName: 'colsConfigButton',
      settingType: 'boolean',
      settingValue: true,
      settingDefaultValue: true,
      bindedControllerPropertieName: 'colsConfigButton'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'exportExcelButton',
      settingType: 'boolean',
      settingValue: false,
      settingDefaultValue: false,
      bindedControllerPropertieName: 'exportExcelButton'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'content',
      settingType: 'hasManyArray',
      settingValue: this.get('model'),
      settingDefaultValue: null,
      settingIsWithoutUI: true,
      bindedControllerPropertieName: 'model'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'modelProjection',
      settingType: 'enumeration',
      settingAvailableItems: this.get('_projectionsNames'),
      settingDefaultValue: null,
      bindedControllerPropertieName: '_projectionName',
      bindedControllerPropertieDisplayName: 'projection',
    });
    componentSettingsMetadata.pushObject({
      settingName: 'modelName',
      settingType: 'string',
      settingValue: 'ember-flexberry-dummy-suggestion',
      settingDefaultValue: undefined,
      settingIsWithoutUI: true
    });
    componentSettingsMetadata.pushObject({
      settingName: 'placeholder',
      settingType: 'string',
      settingDefaultValue: this.get('i18n').t('components.flexberry-objectlistview.placeholder'),
      bindedControllerPropertieName: 'placeholder'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'readonly',
      settingType: 'boolean',
      settingDefaultValue: false,
      bindedControllerPropertieName: 'readonly'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'tableStriped',
      settingType: 'boolean',
      settingDefaultValue: true,
      bindedControllerPropertieName: 'tableStriped'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'allowColumnResize',
      settingType: 'boolean',
      settingDefaultValue: true,
      bindedControllerPropertieName: 'allowColumnResize'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'minAutoColumnWidth',
      settingType: 'number',
      settingDefaultValue: 150,
      bindedControllerPropertieName: 'minAutoColumnWidth'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'columnsWidthAutoresize',
      settingType: 'boolean',
      settingDefaultValue: false,
      bindedControllerPropertieName: 'columnsWidthAutoresize'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'createNewButton',
      settingType: 'boolean',
      settingDefaultValue: false,
      bindedControllerPropertieName: 'createNewButton'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'deleteButton',
      settingType: 'boolean',
      settingDefaultValue: false,
      bindedControllerPropertieName: 'deleteButton'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'showFiltersInModal',
      settingType: 'boolean',
      settingDefaultValue: false,
      bindedControllerPropertieName: 'showFiltersInModal'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'enableFilters',
      settingType: 'boolean',
      settingDefaultValue: false,
      bindedControllerPropertieName: 'enableFilters'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'filterButton',
      settingType: 'boolean',
      settingDefaultValue: false,
      bindedControllerPropertieName: 'filterButton'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'filterByAnyWord',
      settingType: 'boolean',
      settingDefaultValue: false,
      bindedControllerPropertieName: 'filterByAnyWord'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'filterByAllWords',
      settingType: 'boolean',
      settingDefaultValue: false,
      bindedControllerPropertieName: 'filterByAllWords'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'refreshButton',
      settingType: 'boolean',
      settingDefaultValue: false,
      bindedControllerPropertieName: 'refreshButton'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'defaultSortingButton',
      settingType: 'boolean',
      settingDefaultValue: true,
      bindedControllerPropertieName: 'defaultSortingButton'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'showCheckBoxInRow',
      settingType: 'boolean',
      settingDefaultValue: false,
      bindedControllerPropertieName: 'showCheckBoxInRow'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'showEditButtonInRow',
      settingType: 'boolean',
      settingDefaultValue: false,
      bindedControllerPropertieName: 'showEditButtonInRow'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'showPrototypeButtonInRow',
      settingType: 'boolean',
      settingDefaultValue: false,
      bindedControllerPropertieName: 'showPrototypeButtonInRow'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'showDeleteButtonInRow',
      settingType: 'boolean',
      settingDefaultValue: false,
      bindedControllerPropertieName: 'showDeleteButtonInRow'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'showEditMenuItemInRow',
      settingType: 'boolean',
      settingDefaultValue: false,
      bindedControllerPropertieName: 'showEditMenuItemInRow'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'showPrototypeMenuItemInRow',
      settingType: 'boolean',
      settingDefaultValue: false,
      bindedControllerPropertieName: 'showPrototypeMenuItemInRow'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'showDeleteMenuItemInRow',
      settingType: 'boolean',
      settingDefaultValue: false,
      bindedControllerPropertieName: 'showDeleteMenuItemInRow'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'rowClickable',
      settingType: 'boolean',
      settingDefaultValue: true,
      bindedControllerPropertieName: 'rowClickable'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'orderable',
      settingType: 'boolean',
      settingDefaultValue: true,
      bindedControllerPropertieName: 'orderable'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'singleColumnHeaderTitle',
      settingType: 'string',
      settingDefaultValue: undefined,
      bindedControllerPropertieName: 'singleColumnHeaderTitle'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'availableHierarchicalMode',
      settingType: 'boolean',
      settingDefaultValue: false,
      bindedControllerPropertieName: 'availableHierarchicalMode'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'availableCollExpandMode',
      settingType: 'boolean',
      settingDefaultValue: false,
      bindedControllerPropertieName: 'availableCollExpandMode'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'fixedHeader',
      settingType: 'boolean',
      settingDefaultValue: false,
      bindedControllerPropertieName: 'fixedHeader'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'advLimitButton',
      settingType: 'boolean',
      settingDefaultValue: false,
      bindedControllerPropertieName: 'advLimitButton'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'editInModal',
      settingType: 'boolean',
      settingDefaultValue: false,
      bindedControllerPropertieName: 'editInModal'
    });

    return componentSettingsMetadata;
  }),

  _enableFilters: observer('enableFilters', function() {
    if (this.get('enableFilters')) {
      this.set('refreshButton', true);
    }
  }),
});
