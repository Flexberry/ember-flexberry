import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { A } from '@ember/array';
import { htmlSafe } from '@ember/string';

export default Controller.extend({
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
    Template text for 'flexberry-textbox' component.

    @property componentTemplateText
    @type String
   */
  componentTemplateText: new htmlSafe(
    '{{#flexberry-toggler<br>' +
    '  caption=caption<br>' +
    '  expandedCaption=expandedCaption<br>' +
    '  collapsedCaption=collapsedCaption<br>' +
    '  expanded=true<br>' +
    '  iconClass=iconClass<br>' +
    '}}<br>' +
    '  {{t "forms.components-examples.flexberry-toggler.settings-example.togglerContent"}}<br>' +
    '{{/flexberry-toggler}}'),

  /**
    Component settings metadata.

    @property componentSettingsMetadata
    @type Object[]
   */
  componentSettingsMetadata: computed(function() {
    let componentSettingsMetadata = A();
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
      settingName: 'iconClass',
      settingType: 'string',
      settingDefaultValue: undefined,
      bindedControllerPropertieName: 'iconClass'
    });

    return componentSettingsMetadata;
  })
});
