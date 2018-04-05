import Ember from 'ember';
import ListFormController from 'ember-flexberry/controllers/list-form';

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
    Model projection for 'flexberry-simpleolv' component 'modelProjection' property.

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
    Name of related edit form route (for 'flexberry-simpleolv' component 'editFormRoute' property).

    @property editFormRoute
    @type String
   */
  editFormRoute: 'ember-flexberry-dummy-suggestion-edit',

  /**
    Current records.

    @property _records
    @type Object[]
    @protected
    @readOnly
  */
  records: [],

  /**
    Configurate rows 'flexberry-simpleolv' component by address.

    @property configurateRowByAddress
    @type String
   */
  configurateRowByAddress: 'Street, 200',

  _configurateRowByAddress: Ember.observer('configurateRowByAddress', function() {
    let rowConfig = { customClass: '' };

    /* eslint-disable no-unused-vars */
    this.get('records').forEach((record, index, records) => {
      this.send('configurateRow', rowConfig, record);
    });
    /* eslint-enable no-unused-vars */
}),

  /**
    Template text for 'flexberry-simpleolv' component.

    @property componentTemplateText
    @type String
   */
  componentTemplateText: new Ember.String.htmlSafe(
    '{{flexberry-simpleolv<br>' +
    '  configurateRow=(action "configurateRow")<br>' +
    '}}'),

  /**
    Component settings metadata.

    @property componentSettingsMetadata
    @type Object[]
   */
  componentSettingsMetadata: Ember.computed('i18n.locale', function() {
    let componentSettingsMetadata = Ember.A();

    componentSettingsMetadata.pushObject({
      settingName: 'configurateRowByAddress',
      settingType: 'string',
      settingDefaultValue: 'Street, 200',
      bindedControllerPropertieName: 'configurateRowByAddress'
    });

    return componentSettingsMetadata;
  }),

  actions: {
    /**
      Configurate rows on the condition.
    */
    configurateRow(rowConfig, record) {
      if (record) {
        this.get('records').push(record);
      }

      if (record.get('address') === this.get('configurateRowByAddress')) {
        Ember.set(rowConfig, 'customClass', 'positive ');
      } else {
        Ember.set(rowConfig, 'customClass', 'negative ');
      }
    },

    /**
      Change attribute 2.
    */
    changeAttribute2() {
      this.get('records')[1].set('address', 'Street, 200');
    },
  },

});
