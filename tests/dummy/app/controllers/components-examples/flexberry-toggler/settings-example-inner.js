import Ember from 'ember';

export default Ember.Controller.extend({
  /**
    Text for 'flexberry-togggler' component 'caption' property.

    @property caption
    @type String
   */
  caption: '',

  innerCaption: '',

  /**
    Text for 'flexberry-togggler' component 'expandedCaption' property.

    @property expandedCaption
    @type String
   */
  expandedCaption: null,
  expandedInnerCaption: null,

  /**
    Text for 'flexberry-togggler' component 'collapsedCaption' property.

    @property collapsedCaption
    @type String
   */
  collapsedCaption: null,
  collapsedInnerCaption: null,

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
  innerExpanded:false,

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
    '  expanded=expanded<br>' +
    '  iconClass=iconClass<br>' +
    '  componentName="myToggler"<br>' +
    '}}<br>' +
    '  {{t "forms.components-examples.flexberry-toggler.settings-example-inner.togglerContent"}}<br>' +
    '  {{#flexberry-toggler<br>' +
    '    caption=innerCaption<br>' +
    '    expandedCaption=expandedInnerCaption<br>' +
    '    collapsedCaption=collapsedInnerCaption<br>' +
    '    expanded=innerExpanded<br>' +
    '    iconClass=iconClass<br>' +
    '    componentName="myInnerToggler"<br>' +
    '  }}<br>' +
    '    {{t "forms.components-examples.flexberry-toggler.settings-example-inner.innerTogglerContent"}}<br>' +
    '  {{/flexberry-toggler}}<br>' +
    '{{/flexberry-toggler}}'
  ),

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
      settingName: 'innerCaption',
      settingType: 'string',
      settingDefaultValue: '',
      bindedControllerPropertieName: 'innerCaption'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'expandedInnerCaption',
      settingType: 'string',
      settingDefaultValue: null,
      bindedControllerPropertieName: 'expandedInnerCaption'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'collapsedInnerCaption',
      settingType: 'string',
      settingDefaultValue: null,
      bindedControllerPropertieName: 'collapsedInnerCaption'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'innerExpanded',
      settingType: 'boolean',
      settingDefaultValue: false,
      bindedControllerPropertieName: 'innerExpanded'
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
