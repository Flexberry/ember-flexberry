import Ember from 'ember';
import EditFormController from 'ember-flexberry/controllers/edit-form';

export default EditFormController.extend({
  /**
    Counter to mark created records.

    @property _itemsCounter
    @private
    @type Number
    @default 0
  */
  _itemsCounter: 0,

  /**
    Flag indicates that component have to check on model changes and display it.

    @property searchForContentChange
    @type Boolean
    @default true
  */
  searchForContentChange: true,

  /**
    Configurate rows 'flexberry-groupedit' component by address.

    @property configurateRowByFlag
    @type String
  */
  configurateRowByFlag: 1,

  _configurateRowByFlag: Ember.observer('configurateRowByFlag', function() {
    let rowConfig = { customClass: '' };

    this.get('records').forEach((record, index, records) => {
      this.send('configurateRow', rowConfig, record);
    });
  }),

  /**
    Template text for 'flexberry-groupedit' component.

    @property componentTemplateText
    @type String
  */
  componentTemplateText: new Ember.Handlebars.SafeString(
    '{{flexberry-groupedit<br>' +
    '  configurateRow=(action \"configurateRow\")<br>' +
    '}}'),

  /**
    Component settings metadata.

    @property componentSettingsMetadata
    @type Object[]
  */
  componentSettingsMetadata: Ember.computed('i18n.locale', function() {
    let componentSettingsMetadata = Ember.A();

    componentSettingsMetadata.pushObject({
      settingName: 'configurateRowByFlag',
      settingType: 'boolean',
      settingDefaultValue: 1,
      bindedControllerPropertieName: 'configurateRowByFlag',
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

      if (record.get('flag') === this.get('configurateRowByFlag')) {
        rowConfig.showDeleteButtonInRow = false;
      }
    },
  },

});
