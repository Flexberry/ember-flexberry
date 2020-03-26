import Ember from 'ember';
import EditFormController from 'ember-flexberry/controllers/edit-form';
import { translationMacro as t } from 'ember-i18n';
const { getOwner } = Ember;

export default EditFormController.extend({
  /**
    Name of selected detail's model projection.

    @property _detailsProjectionName
    @type String
    @private
   */
  _detailsProjectionName: 'DetailE',

  /**
    Array of available detail's model projections.

    @property _detailsProjections
    @type Object[]
   */
  _detailsProjections: Ember.computed('model.details.relationship.belongsToType', function() {
    let detailsModelName = this.get('model.details.relationship.belongsToType');
    let detailsClass = getOwner(this)._lookupFactory('model:' + detailsModelName);

    return Ember.get(detailsClass, 'projections');
  }),

  /**
    Array of available detail's model projections names.

    @property _detailsProjectionsNames
    @type String[]
   */
  _detailsProjectionsNames: Ember.computed('_detailsProjections.[]', function() {
    let detailsProjections = this.get('_detailsProjections');
    if (Ember.isNone(detailsProjections)) {
      return [];
    }
    
    let detailsProjectionNames = Object.keys(detailsProjections);
    detailsProjectionNames.splice(detailsProjectionNames.indexOf('modelName'), 1);
    return detailsProjectionNames;
  }),

  /**
    Model projection for 'flexberry-groupedit' component 'modelProjection' property.

    @property detailsProjection
    @type Object
   */
  detailsProjection: Ember.computed('_detailsProjections.[]', '_detailsProjectionName', function() {
    let detailsProjectionName = this.get('_detailsProjectionName');
    if (Ember.isBlank(detailsProjectionName)) {
      return null;
    }

    let detailsModelName = this.get('model.details.relationship.belongsToType');
    let detailsClass = getOwner(this)._lookupFactory('model:' + detailsModelName);
    let detailsClassProjections = Ember.get(detailsClass, 'projections');
    if (Ember.isNone(detailsClassProjections)) {
      return null;
    }

    return detailsClassProjections[detailsProjectionName];
  }),

  /**
    Text for 'flexberry-groupedit' component 'placeholder' property.

    @property placeholder
    @type String
   */
  placeholder: t('components.flexberry-groupedit.placeholder'),
  /**
    Handles changes in placeholder.

    @method _placeholderChanged
    @private
   */
  _placeholderChanged: Ember.observer('placeholder', function() {
    if (this.get('placeholder') === this.get('i18n').t('components.flexberry-groupedit.placeholder').toString()) {
      this.set('placeholder', t('components.flexberry-groupedit.placeholder'));
    }
  }),
  /**
    Flag: indicates whether 'flexberry-groupedit' component is in 'readonly' mode or not.

    @property readonly
    @type Boolean
   */
  readonly: false,

  /**
    Flag: indicates whether to show default settings button at toolbar.

    @property defaultSettingsButton
    @type Boolean
    @default false
   */
  defaultSettingsButton: false,

  /**
    Flag for 'flexberry-groupedit' component 'tableStriped' property.

    @property tableStriped
    @type Boolean
   */
  tableStriped: true,

  /**
    Flag for 'flexberry-groupedit' component 'createNewButton' property.

    @property createNewButton
    @type Boolean
   */
  createNewButton: true,

  /**
    Flag for 'flexberry-groupedit' component 'deleteButton' property.

    @property deleteButton
    @type Boolean
   */
  deleteButton: true,

  /**
    Flag: indicates whether 'flexberry-objectlistview' component is in 'defaultSortingButton' mode or not

    @property defaultSortingButton
    @type Boolean
    @default true
  */
  defaultSortingButton: true,

  /**
    Flag indicates whether to fix the table head (if `true`) or not (if `false`).

    @property fixedHeader
    @type Boolean
    @default true
  */
  fixedHeader: false,

  /**
    Flag for 'flexberry-groupedit' component 'allowColumnResize' property.

    @property allowColumnResize
    @type Boolean
   */
  allowColumnResize: true,

  /**
    Flag for 'flexberry-groupedit' component 'showAsteriskInRow' property.

    @property showAsteriskInRow
    @type Boolean
   */
  showAsteriskInRow: true,

  /**
    Flag for 'flexberry-groupedit' component 'showCheckBoxInRow' property.

    @property showCheckBoxInRow
    @type Boolean
   */
  showCheckBoxInRow: true,

  /**
    Flag for 'flexberry-groupedit' component 'showDeleteButtonInRow' property.

    @property showDeleteButtonInRow
    @type Boolean
   */
  showDeleteButtonInRow: false,

  /**
    Flag for 'flexberry-groupedit' component 'showDeleteButtonInRow' property.

    @property showDeleteButtonInRow
    @type Boolean
   */
  showEditMenuItemInRow: false,

  /**
    Flag for 'flexberry-groupedit' component 'showDeleteButtonInRow' property.

    @property showDeleteButtonInRow
    @type Boolean
   */
  showDeleteMenuItemInRow: false,

  /**
    Text for 'flexberry-groupedit' component 'singleColumnHeaderTitle' property.

    @property singleColumnHeaderTitle
    @type Boolean
   */
  singleColumnHeaderTitle: undefined,

  /**
    Flag for 'flexberry-groupedit' component 'rowClickable' property.

    @property rowClickable
    @type Boolean
   */
  rowClickable: false,

  /**
    Flag for 'flexberry-groupedit' component 'immediateDelete' property.

    @property immediateDelete
    @type Boolean
   */
  immediateDelete: false,

  /**
    Template text for 'flexberry-groupedit' component.

    @property componentTemplateText
    @type String
   */
  componentTemplateText: new Ember.Handlebars.SafeString(
    '{{flexberry-groupedit<br>' +
    '  componentName=\"aggregatorDetailsGroupedit\"<br>' +
    '  content=model.details<br>' +
    '  modelProjection=detailsProjection<br>' +
    '  placeholder=placeholder<br>' +
    '  readonly=readonly<br>' +
    '  tableStriped=tableStriped<br>' +
    '  createNewButton=createNewButton<br>' +
    '  deleteButton=deleteButton<br>' +
    '  defaultSortingButton=defaultSortingButton<br>' +
    '  allowColumnResize=allowColumnResize<br>' +
    '  showAsteriskInRow=showAsteriskInRow<br>' +
    '  showCheckBoxInRow=showCheckBoxInRow<br>' +
    '  showDeleteButtonInRow=showDeleteButtonInRow<br>' +
    '  showEditMenuItemInRow=showEditMenuItemInRow<br>' +
    '  showDeleteMenuItemInRow=showDeleteMenuItemInRow<br>' +
    '  singleColumnHeaderTitle=singleColumnHeaderTitle<br>' +
    '  rowClickable=rowClickable<br>' +
    '  immediateDelete=immediateDelete<br>' +
    '  defaultSettingsButton=defaultSettingsButton<br>' +
    '  fixedHeader=fixedHeader<br>' +
    '}}'),

  /**
    Component settings metadata.

    @property componentSettingsMetadata
    @type Object[]
   */
  componentSettingsMetadata: Ember.computed('i18n.locale', function() {
    let componentSettingsMetadata = Ember.A();

    componentSettingsMetadata.pushObject({
      settingName: 'componentName',
      settingType: 'string',
      settingValue: 'aggregatorDetailsGroupedit',
      settingDefaultValue: undefined,
      settingIsWithoutUI: true
    });
    componentSettingsMetadata.pushObject({
      settingName: 'content',
      settingType: 'hasManyArray',
      settingValue: this.get('model.details'),
      settingDefaultValue: null,
      settingIsWithoutUI: true,
      bindedControllerPropertieName: 'model.details'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'modelProjection',
      settingType: 'enumeration',
      settingAvailableItems: this.get('_detailsProjectionsNames'),
      settingDefaultValue: null,
      bindedControllerPropertieName: '_detailsProjectionName',
      bindedControllerPropertieDisplayName: 'detailsProjection',
    });
    componentSettingsMetadata.pushObject({
      settingName: 'placeholder',
      settingType: 'string',
      settingDefaultValue: this.get('i18n').t('components.flexberry-groupedit.placeholder'),
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
      settingName: 'createNewButton',
      settingType: 'boolean',
      settingDefaultValue: true,
      bindedControllerPropertieName: 'createNewButton'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'deleteButton',
      settingType: 'boolean',
      settingDefaultValue: true,
      bindedControllerPropertieName: 'deleteButton'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'allowColumnResize',
      settingType: 'boolean',
      settingDefaultValue: true,
      bindedControllerPropertieName: 'allowColumnResize'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'showAsteriskInRow',
      settingType: 'boolean',
      settingDefaultValue: true,
      bindedControllerPropertieName: 'showAsteriskInRow'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'showCheckBoxInRow',
      settingType: 'boolean',
      settingDefaultValue: true,
      bindedControllerPropertieName: 'showCheckBoxInRow'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'showDeleteButtonInRow',
      settingType: 'boolean',
      settingDefaultValue: false,
      bindedControllerPropertieName: 'showDeleteButtonInRow'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'defaultSortingButton',
      settingType: 'boolean',
      settingDefaultValue: true,
      bindedControllerPropertieName: 'defaultSortingButton'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'showEditMenuItemInRow',
      settingType: 'boolean',
      settingDefaultValue: false,
      bindedControllerPropertieName: 'showEditMenuItemInRow'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'showDeleteMenuItemInRow',
      settingType: 'boolean',
      settingDefaultValue: false,
      bindedControllerPropertieName: 'showDeleteMenuItemInRow'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'singleColumnHeaderTitle',
      settingType: 'string',
      settingDefaultValue: undefined,
      bindedControllerPropertieName: 'singleColumnHeaderTitle'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'rowClickable',
      settingType: 'boolean',
      settingDefaultValue: false,
      bindedControllerPropertieName: 'rowClickable'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'immediateDelete',
      settingType: 'boolean',
      settingDefaultValue: false,
      bindedControllerPropertieName: 'immediateDelete'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'defaultSettingsButton',
      settingType: 'boolean',
      settingDefaultValue: false,
      bindedControllerPropertieName: 'defaultSettingsButton'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'fixedHeader',
      settingType: 'boolean',
      settingDefaultValue: false,
      bindedControllerPropertieName: 'fixedHeader'
    });

    return componentSettingsMetadata;
  }),

  /**
    Method to get type and attributes of a component,
    which will be embeded in object-list-view cell.

    @method getCellComponent.
    @param {Object} attr Attribute of projection property related to current table cell.
    @param {String} bindingPath Path to model property related to current table cell.
    @param {DS.Model} modelClass Model class of data record related to current table row.
    @return {Object} Object containing name & properties of component, which will be used to render current table cell.
    { componentName: 'my-component',  componentProperties: { ... } }.
   */
  getCellComponent: function(attr, bindingPath) {
    var cellComponent = this._super(...arguments);

    if (attr.kind === 'belongsTo' && bindingPath === 'master') {
      cellComponent.componentProperties = {
        componentName:'GroupEditSettingExampleMaster',
        projection: 'MasterL',
        displayAttributeName: 'text',
        title: 'Master',
        relationName: 'master',
        choose: 'showLookupDialog',
        remove: 'removeLookupValue'
      };
    }

    return cellComponent;
  },

  /**
    Lookup events service.
  */
  lookupEvents: Ember.inject.service('lookup-events'),

  actions: {
    /**
      Handles click on lookup's choose button.
    */
    showLookupDialog() {
      // Create new master & add to model.
      let master = this.get('store').createRecord('components-examples/flexberry-groupedit/shared/master', { text: 'Master text' });
      let deteils = this.get('model.details');

      deteils.forEach((item) => {
        item.set('master', master);
      });

      this.get('lookupEvents').lookupDialogOnHiddenTrigger('GroupEditSettingExampleMaster');
    }
  }
});
