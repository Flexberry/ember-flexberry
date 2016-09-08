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

    let momentDate = this.get('moment').moment(serializedDate);
    if (momentDate.isValid()) {
      this.set(datePropertyName, momentDate.toDate());
    } else {
      this.set(datePropertyName, new Date('invalid'));
    }
  },

  /**
    Default display format.

    @property dateTimeFormat
    @type String
   */
  dateTimeFormat: 'DD.MM.YYYY',

  /**
    Template text for 'flexberry-datepicker' component.

    @property componentTemplateText
    @type String
   */
  componentTemplateText: new Ember.Handlebars.SafeString(
    '{{daterangepicker-example<br>' +
    '}}',
    ),

  /**
    Component settings metadata.

    @property componentSettingsMetadata
    @type Object[]
   */
  componentSettingsMetadata: Ember.computed('i18n.locale', function() {
    let componentSettingsMetadata = Ember.A();

    return componentSettingsMetadata;
  })
});
