import Ember from 'ember';

export default Ember.Controller.extend({
  /**
    Serialized model date.

    @property _serializedModelDate
    @type String
    @private
   */
  _serializedModelDate: undefined,

  /**
    Serialized min date.

    @property _serializedMinDate
    @type String
    @private
   */
  _serializedMinDate: undefined,

  /**
    Serialized max date.

    @property _serializedMaxDate
    @type String
    @private
   */
  _serializedMaxDate: undefined,

  /**
    Handles changes in serialized model date.

    @method _serializedModelDateDidChange
    @private
   */
  _serializedModelDateDidChange: Ember.observer('_serializedModelDate', function() {
    Ember.run.once(this, '_changeDateProperty', '_serializedModelDate', 'model.date');
  }),

  /**
    Handles changes in min date.

    @method _serializedMinDateDidChange
    @private
   */
  _serializedMinDateDidChange: Ember.observer('_serializedMinDate', function() {
    Ember.run.once(this, '_changeDateProperty', '_serializedMinDate', 'min');
  }),

  /**
    Handles changes in serialized max date.

    @method _serializedMaxDateDidChange
    @private
   */
  _serializedMaxDateDidChange: Ember.observer('_serializedMaxDate', function() {
    Ember.run.once(this, '_changeDateProperty', '_serializedMaxDate', 'max');
  }),

  /**
    Handles changes in model date.

    @method _modelDateDidChange
    @private
   */
  _modelDateDidChange: Ember.observer('model.date', function() {
    Ember.run.once(this, '_changeSerializedDateProperty', '_serializedModelDate', 'model.date');
  }),

  /**
    Handles changes in some of the serialized date properties.

    @method _changeDateProperty
    @param {String} serializedDatePropertyName Name of serialized date property.
    @param {Date} datePropertyName Name of date property which need to be parsed.
    @private
   */
  _changeDateProperty(serializedDatePropertyName, datePropertyName) {
    let serializedDate = this.get(serializedDatePropertyName);
    if (Ember.typeOf(serializedDate) === 'undefined') {
      return;
    }

    if (serializedDate === '') {
      this.set(datePropertyName, null);
      return;
    }

    let momentDate = this.get('moment').moment(serializedDate);
    if (momentDate.isValid()) {
      this.set(datePropertyName, momentDate.toDate());
    } else {
      this.set(datePropertyName, new Date('invalid'));
    }
  },

  /**
    Handles changes in some of the date properties.

    @method _changeSerializedDateProperty
    @param {String} serializedDatePropertyName Name of serialized date property which need to be changed.
    @param {Date} datePropertyName Name of date property which contains value.
    @private
   */
  _changeSerializedDateProperty(serializedDatePropertyName, datePropertyName) {
    let date = this.get(datePropertyName);
    if (date === null || Ember.typeOf(date) === 'undefined') {
      return;
    }

    let momentDate = this.get('moment').moment(date);
    if (momentDate.isValid()) {
      this.set(serializedDatePropertyName, momentDate.format('YYYY-MM-DDTHH:MM'));
    } else {
      this.set(serializedDatePropertyName, '' + new Date('invalid'));
    }
  },

  /**
   Minimum value of this component.

   @property min
   @type Date
   */
  min: undefined,
  /**
    Maximum value of this component.

   @property max
   @type Date
   */
  max: undefined,

  /**
    Flag: indicates whether 'flexberry-simpledatetime' component is in 'readonly' mode or not.

    @property readonly
    @type Boolean
   */
  readonly: false,

  /**
    Template text for 'flexberry-simpledatetime' component.

    @property componentTemplateText
    @type String
   */
  componentTemplateText: new Ember.Handlebars.SafeString(
    '{{flexberry-simpledatetime<br>' +
    '..type=\"datetime-local\"<br>' +
    '..value=model.date<br>' +
    '..min=min<br>' +
    '..max=max<br>' +
    '..readonly=readonly<br>' +
    '}}'),

  /**
    Component settings metadata.

    @property componentSettingsMetadata
    @type Object[]
   */
  componentSettingsMetadata: Ember.computed('i18n.locale', function() {
    let componentSettingsMetadata = Ember.A();

    componentSettingsMetadata.pushObject({
      settingName: 'type',
      settingType: 'string',
      settingValue: 'datetime-local',
      settingDefaultValue: undefined,
      settingIsWithoutUI: true
    });
    componentSettingsMetadata.pushObject({
      settingName: 'min',
      settingType: 'date',
      settingDefaultValue: undefined,
      bindedControllerPropertieName: '_serializedMinDate',
      bindedControllerPropertieDisplayName: 'min'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'max',
      settingType: 'date',
      settingDefaultValue: undefined,
      bindedControllerPropertieName: '_serializedMaxDate',
      bindedControllerPropertieDisplayName: 'max'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'value',
      settingType: 'date',
      settingDefaultValue: undefined,
      bindedControllerPropertieName: '_serializedModelDate',
      bindedControllerPropertieDisplayName: 'model.date'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'readonly',
      settingType: 'boolean',
      settingDefaultValue: 'false',
      bindedControllerPropertieName: 'readonly'
    });

    return componentSettingsMetadata;
  })
});
