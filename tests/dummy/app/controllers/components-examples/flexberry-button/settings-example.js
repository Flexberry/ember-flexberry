import Ember from 'ember';
import FlexberryDdauCheckboxActionsHandlerMixin from 'ember-flexberry/mixins/flexberry-ddau-checkbox-actions-handler';

export default Ember.Controller.extend(FlexberryDdauCheckboxActionsHandlerMixin, {
  /**
    Component's wrapper CSS-classes.

    @property class
    @type String
  */
  class: '',

  /**
    Component's icon CSS-class names.

    @property iconClass
    @type String
    @default null
  */
  iconClass: null,

  /**
    Text for 'flexberry-button' 'caption' property.

    @property caption
    @type String
    @default null
  */
  caption: null,

  /**
    Component's tooltip text.
    Will be added as wrapper's element 'title' attribute.

    @property tooltip
    @default null
  */
  tooltip: null,

  /**
    Flag: indicates whether 'flexberry-button' component is in 'readonly' mode or not.

    @property readonly
    @type Boolean
   */
  readonly: false,

  /**
    Template text for 'flexberry-button' component.

    @property componentTemplateText
    @type String
   */
  componentTemplateText: new Ember.String.htmlSafe(
    '{{flexberry-button<br>' +
    '  class=class<br>' +
    '  iconClass=class<br>' +
    '  caption=caption<br>' +
    '  tooltip=tooltip<br>' +
    '  readonly=readonly<br>' +
    '  click=(action "onButtonClick")<br>' +
    '}}'),

  /**
    Component settings metadata.

    @property componentSettingsMetadata
    @type Object[]
   */
  componentSettingsMetadata: Ember.computed('i18n.locale', function() {
    let componentSettingsMetadata = Ember.A();

    componentSettingsMetadata.pushObject({
      settingName: 'class',
      settingType: 'css',
      settingDefaultValue: '',
      settingAvailableItems: [
        'circular',
        'fluid',
        'loading',
        'red',
        'green',
        'blue',
        'top attached',
        'bottom attached',
        'left attached',
        'right attached'
      ],
      bindedControllerPropertieName: 'class'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'iconClass',
      settingType: 'enumeration',
      settingAvailableItems: [
        'edit icon',
        'cut icon',
        'attach icon',
        'add square icon',
        'download icon'
      ],
      settingDefaultValue: null,
      bindedControllerPropertieName: 'iconClass'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'caption',
      settingType: 'string',
      settingDefaultValue: null,
      bindedControllerPropertieName: 'caption'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'tooltip',
      settingType: 'string',
      settingDefaultValue: null,
      bindedControllerPropertieName: 'tooltip'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'readonly',
      settingType: 'boolean',
      settingDefaultValue: false,
      bindedControllerPropertieName: 'readonly'
    });

    return componentSettingsMetadata;
  }),

  actions: {
    onButtonClick(e) {
      // eslint-disable-next-line no-console
      console.log('Button clicked. Click event-object: ', e);
    }
  }
});
