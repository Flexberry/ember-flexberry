import Ember from 'ember';
import Enumeration from '../../../enums/components-examples/flexberry-dropdown/settings-example/enumeration';
import { enumCaptions } from 'ember-flexberry-data/utils/enum-functions';
import { translationMacro as t } from 'ember-i18n';

export default Ember.Controller.extend({
  /**
    Component's wrapper CSS classes.

    @property class
    @type String
  */
  class: '',

  /**
    Text for 'flexberry-dropdown' component 'placeholder' property.

    @property placeholder
    @type String
   */
  placeholder: t('components.flexberry-dropdown.placeholder'),

  /**
    Handles changes in placeholder.

    @method _placeholderChanged
    @private
   */
  _placeholderChanged: Ember.observer('placeholder', function() {
    if (this.get('placeholder') === this.get('i18n').t('components.flexberry-dropdown.placeholder').toString()) {
      this.set('placeholder', t('components.flexberry-dropdown.placeholder'));
    }
  }),

  /**
    Flag: indicates whether 'flexberry-dropdown' component is in 'readonly' mode or not.

    @property readonly
    @type Boolean
   */
  readonly: false,

  /**
    Semantic-ui settings.
    For more information see [semantic-ui](http://semantic-ui.com/modules/dropdown.html#/settings)
  */
  on: 'click',
  allowReselection: false,
  allowAdditions: false,
  hideAdditions: true,
  minCharacters: 1,
  match: 'both',
  selectOnKeydown: true,
  forceSelection: true,
  allowCategorySelection: false,
  direction: 'auto',
  keepOnScreen: true,
  context: 'windows',
  fullTextSearch: false,
  preserveHTML: true,
  sortSelect: false,
  showOnFocus: true,
  allowTab: true,
  transition: 'auto',
  duration: 200,

  /**
    Template text for 'flexberry-dropdown' component.

    @property componentTemplateText
    @type String
   */
  componentTemplateText: new Ember.Handlebars.SafeString(
    '{{flexberry-dropdown<br>' +
    '  items=(flexberry-enum \"components-examples/flexberry-dropdown/settings-example/enumeration\")<br>' +
    '  value=model.enumeration<br>' +
    '  placeholder=placeholder<br>' +
    '  readonly=readonly<br>' +
    '  class=class<br>' +
    '  on="click"<br>' +
    '  allowReselection=false<br>' +
    '  allowAdditions=false<br>' +
    '  hideAdditions=true<br>' +
    '  minCharacters=1<br>' +
    '  match="both"<br>' +
    '  selectOnKeydown=true<br>' +
    '  forceSelection=true<br>' +
    '  allowCategorySelection=false<br>' +
    '  direction="auto"<br>' +
    '  keepOnScreen=true<br>' +
    '  context="windows"<br>' +
    '  fullTextSearch=false<br>' +
    '  preserveHTML=true<br>' +
    '  sortSelect=false<br>' +
    '  showOnFocus=true<br>' +
    '  allowTab=true<br>' +
    '  transition="auto"<br>' +
    '  duration=200<br>' +
    '}}'),

  /**
    Component settings metadata.

    @property componentSettingsMetadata
    @type Object[]
   */
  componentSettingsMetadata: Ember.computed('i18n.locale', function() {
    var componentSettingsMetadata = Ember.A();
    componentSettingsMetadata.pushObject({
      settingName: 'value',
      settingType: 'enumeration',
      settingAvailableItems: enumCaptions(Enumeration),
      settingDefaultValue: undefined,
      bindedControllerPropertieName: 'model.enumeration'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'placeholder',
      settingType: 'string',
      settingDefaultValue: this.get('i18n').t('components.flexberry-dropdown.placeholder'),
      bindedControllerPropertieName: 'placeholder'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'readonly',
      settingType: 'boolean',
      settingDefaultValue: false,
      bindedControllerPropertieName: 'readonly'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'class',
      settingType: 'css',
      settingDefaultValue: '',
      settingAvailableItems: ['scrolling', 'compact', 'fluid'],
      bindedControllerPropertieName: 'class'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'on',
      settingType: 'string',
      settingDefaultValue: 'click',
      bindedControllerPropertieName: 'on'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'allowReselection',
      settingType: 'boolean',
      settingDefaultValue: false,
      bindedControllerPropertieName: 'allowReselection'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'allowAdditions',
      settingType: 'boolean',
      settingDefaultValue: false,
      bindedControllerPropertieName: 'allowAdditions'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'hideAdditions',
      settingType: 'boolean',
      settingDefaultValue: true,
      bindedControllerPropertieName: 'hideAdditions'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'minCharacters',
      settingType: 'number',
      settingDefaultValue: 1,
      bindedControllerPropertieName: 'minCharacters'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'match',
      settingType: 'string',
      settingDefaultValue: 'both',
      bindedControllerPropertieName: 'match'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'selectOnKeydown',
      settingType: 'boolean',
      settingDefaultValue: true,
      bindedControllerPropertieName: 'selectOnKeydown'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'forceSelection',
      settingType: 'boolean',
      settingDefaultValue: true,
      bindedControllerPropertieName: 'forceSelection'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'allowCategorySelection',
      settingType: 'boolean',
      settingDefaultValue: false,
      bindedControllerPropertieName: 'allowCategorySelection'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'direction',
      settingType: 'string',
      settingDefaultValue: 'auto',
      bindedControllerPropertieName: 'direction'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'keepOnScreen',
      settingType: 'boolean',
      settingDefaultValue: true,
      bindedControllerPropertieName: 'keepOnScreen'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'context',
      settingType: 'string',
      settingDefaultValue: 'windows',
      bindedControllerPropertieName: 'context'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'fullTextSearch',
      settingType: 'boolean',
      settingDefaultValue: false,
      bindedControllerPropertieName: 'fullTextSearch'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'preserveHTML',
      settingType: 'boolean',
      settingDefaultValue: true,
      bindedControllerPropertieName: 'preserveHTML'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'sortSelect',
      settingType: 'boolean',
      settingDefaultValue: false,
      bindedControllerPropertieName: 'sortSelect'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'showOnFocus',
      settingType: 'boolean',
      settingDefaultValue: true,
      bindedControllerPropertieName: 'showOnFocus'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'allowTab',
      settingType: 'boolean',
      settingDefaultValue: true,
      bindedControllerPropertieName: 'allowTab'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'transition',
      settingType: 'string',
      settingDefaultValue: 'auto',
      bindedControllerPropertieName: 'transition'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'duration',
      settingType: 'number',
      settingDefaultValue: 200,
      bindedControllerPropertieName: 'duration'
    });
    return componentSettingsMetadata;
  })
});
