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
    Handles changes in serialized model date.

    @method _serializedModelDateDidChange
    @private
   */
  _serializedModelDateDidChange: Ember.observer('_serializedModelDate', function() {
    Ember.run.once(this, '_changeDateProperty', '_serializedModelDate', 'model.date');
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

    this.set(datePropertyName, serializedDate);
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

    this.set(serializedDatePropertyName, date);
  },

  /**
    Minimum value of this component.

    @property min
    @type Date
    @default 'today'
   */
  min: new Date(),

  /**
    Maximum value of this component.

    @property max
    @type Date
    @default 'today' + 7 days
   */
  max: new Date().fp_incr(14),

  /**
    Flag indicates whether 'flexberry-simpledatetime' component is in 'readonly' mode or not.

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
    '  type=\"datetime-local\"<br>' +
    '  value=model.date<br>' +
    '  min=min<br>' +
    '  max=max<br>' +
    '  readonly=readonly<br>' +
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
      settingDefaultValue: this._convertDateToString(this.get('min')),
    });
    componentSettingsMetadata.pushObject({
      settingName: 'max',
      settingType: 'date',
      settingDefaultValue: this._convertDateToString(this.get('max')),
    });
    componentSettingsMetadata.pushObject({
      settingName: 'value',
      settingType: 'datetime',
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
  }),

  _supportDateType: Ember.computed(function() {
    if (this._checkInput('date') || this._checkInput('datetime') || this._checkInput('datetime-local')) {
      return true;
    }

    return false;
  }),

  /**
    Convert Date object to appropriate string value for input.

    @method _convertDateToString
    @param {Date} value Object of Date.
    @return {String} Date in string format.
    @private
  */
  _convertDateToString(value) {
    if (value == null) {
      return value;
    }

    if (typeof value !== 'object') {
      throw new Error('Value must be a Date object.');
    }

    let momentDate = this.get('moment').moment(value);
    return momentDate.format('DD.MM.YYYY HH:MM');
  },

  /**
    The method checks if some input type is supported by the browser.

    @method _checkInput
    @param {String} type Type of input.
    return {Boolean}
    @private
  */
  _checkInput(type) {
    let input = document.createElement('input');
    input.setAttribute('type', type);
    return input.type === type;
  },
});
