import Ember from 'ember';

export default Ember.Controller.extend({
  /**
   * Label for 'flexberry-checkbox' component 'label' property.
   *
   * @property label
   * @type String
   */
  label: undefined,

  /**
   * Flag: indicates whether 'flexberry-checkbox' component is in 'readonly' mode or not.
   *
   * @property readonly
   * @type Boolean
   */
  readonly: false,

  /**
   * Template text for 'flexberry-checkbox' component.
   *
   * @property componentTemplateText
   * @type String
   */
  componentTemplateText: new Ember.Handlebars.SafeString(
    '{{flexberry-checkbox<br>' +
    '..value=model.flag<br>' +
    '..label=label<br>' +
    '..readonly=readonly<br>' +
    '}}'),

  /**
   * Component settings metadata.
   *
   * @property componentSettingsMetadata
   * @type Object[]
   */
  componentSettingsMetadata: Ember.computed(function() {
    var componentSettingsMetadata = Ember.A();
    componentSettingsMetadata.pushObject({
      settingName: 'value',
      settingType: 'boolean',
      settingDefaultValue: 'undefined',
      bindedControllerPropertieName: 'model.flag'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'label',
      settingType: 'string',
      settingDefaultValue: 'undefined',
      bindedControllerPropertieName: 'label'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'readonly',
      settingType: 'boolean',
      settingDefaultValue: 'false',
      bindedControllerPropertieName: 'readonly'
    });

    return componentSettingsMetadata;
  }),

  /**
   * Initializes controller.
   *
   * @method init
   */
  init: function() {
    this._super(...arguments);
  }
});
