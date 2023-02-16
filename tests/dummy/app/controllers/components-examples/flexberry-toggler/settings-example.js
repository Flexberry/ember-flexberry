import Ember from 'ember';

export default Ember.Controller.extend({
  /**
    Text for 'flexberry-togggler' component 'caption' property.

    @property caption
    @type String
   */
  caption: '',

  /**
    Text for 'flexberry-togggler' component 'expandedCaption' property.

    @property expandedCaption
    @type String
   */
  expandedCaption: null,

  /**
    Text for 'flexberry-togggler' component 'collapsedCaption' property.

    @property collapsedCaption
    @type String
   */
  collapsedCaption: null,

  /**
    CSS clasess for i tag.

    @property iconClass
    @type String
  */
  iconClass: '',

  /**
    Current visibility state.

    @property expanded
    @type Boolean
    @default true
  */
  expanded: true,

  /**
    If true - border with a border appears for toggler. If false - border doesn't appear.

    @property hasBorder
    @type Boolean
    @default false
  */
  hasBorder: false,

  /**
   * If true - border with a subtle shadow appears for toggler. If false - shadow doesn't appear.

   @property hasShadow
   @type Boolean
   @default false
   */
  hasShadow: false,

  /**
    Template text for 'flexberry-textbox' component.

    @property componentTemplateText
    @type String
   */
  componentTemplateText: new Ember.Handlebars.SafeString(
    '{{#flexberry-toggler<br>' +
    '  caption=caption<br>' +
    '  expandedCaption=expandedCaption<br>' +
    '  collapsedCaption=collapsedCaption<br>' +
    '  expanded=true<br>' +
    '  componentName="myToggler"<br>' +
    '  iconClass=iconClass<br>' +
    '  hasBorder=hasBorder<br>' +
    '  hasShadow=hasShadow<br>' +
    '}}<br>' +
    '  {{t "forms.components-examples.flexberry-toggler.settings-example.togglerContent"}}<br>' +
    '{{/flexberry-toggler}}'),

  /**
    Component settings metadata.

    @property componentSettingsMetadata
    @type Object[]
   */
  componentSettingsMetadata: Ember.computed(function() {
    let componentSettingsMetadata = Ember.A();
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
      settingName: 'expanded',
      settingType: 'boolean',
      settingDefaultValue: false,
      bindedControllerPropertieName: 'expanded'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'hasBorder',
      settingType: 'boolean',
      settingDefaultValue: false,
      bindedControllerPropertieName: 'hasBorder'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'hasShadow',
      settingType: 'boolean',
      settingDefaultValue: false,
      bindedControllerPropertieName: 'hasShadow'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'iconClass',
      settingType: 'string',
      settingDefaultValue: undefined,
      bindedControllerPropertieName: 'iconClass'
    });

    return componentSettingsMetadata;
  })
});
