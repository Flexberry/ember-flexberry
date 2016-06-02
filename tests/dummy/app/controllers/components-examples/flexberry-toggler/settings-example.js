import Ember from 'ember';

export default Ember.Controller.extend({
  /**
    Caption for 'flexberry-togggler' component 'caption' property.

    @property caption
    @type String
   */
  caption: '',

  /**
    Caption for 'flexberry-togggler' component 'expandedCaption' property.

    @property expandedCaption
    @type String
   */
  expandedCaption: null,

  /**
    Caption for 'flexberry-togggler' component 'collapsedCaption' property.

    @property collapsedCaption
    @type String
   */
  collapsedCaption: null,

  /**
    Flag: indicates whether 'flexberry-toggler' component is in 'readonly' mode or not.

    @property readonly
    @type Boolean
   */
  readonly: false,

  /**
    Template text for 'flexberry-textbox' component.

    @property componentTemplateText
    @type String
   */
  componentTemplateText: new Ember.Handlebars.SafeString(
    '{{#flexberry-toggler<br>' +
    '..caption=caption<br>' +
    '..expandedCaption=expandedCaption<br>' +
    '..collapsedCaption=collapsedCaption<br>' +
    '..readonly=readonly<br>' +
    '}}<br>' +
    '..Some expandable/collapsable content<br>' +
    '{{/flexberry-toggler}}'),

  /**
    Component settings metadata.

    @property componentSettingsMetadata
    @type Object[]
   */
  componentSettingsMetadata: Ember.computed(function() {
    var componentSettingsMetadata = Ember.A();
    componentSettingsMetadata.pushObject({
      settingName: 'caption',
      settingType: 'string',
      settingDefaultValue: '',
      bindedControllerPropertieName: 'caption'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'expandedCaption',
      settingType: 'string',
      settingDefaultValue: null,
      bindedControllerPropertieName: 'expandedCaption'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'collapsedCaption',
      settingType: 'string',
      settingDefaultValue: null,
      bindedControllerPropertieName: 'collapsedCaption'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'readonly',
      settingType: 'boolean',
      settingDefaultValue: false,
      bindedControllerPropertieName: 'readonly'
    });

    return componentSettingsMetadata;
  })
});
