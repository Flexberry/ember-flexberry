import Controller from '@ember/controller';
import { htmlSafe } from '@ember/string';
import { computed } from '@ember/object';
import { A } from '@ember/array';
import { next } from '@ember/runloop';

export default Controller.extend({
  /**
    Reload tabs flag.

    @property reloadTabs
    @type boolean
  */
  reloadTabs: true,

  /**
    Array of tabs.

    @property items
    @type Array
  */
  items: computed('i18n.locale', function() {
    let i18n = this.get('i18n');

    return [
      { selector: 'tab1', caption: i18n.t('forms.components-examples.flexberry-tab-bar.settings-example.tab_1'), active: true },
      { selector: 'tab2', caption: i18n.t('forms.components-examples.flexberry-tab-bar.settings-example.tab_2') },
      { selector: 'tab3', caption: i18n.t('forms.components-examples.flexberry-tab-bar.settings-example.tab_3') },
      { selector: 'tab4', caption: i18n.t('forms.components-examples.flexberry-tab-bar.settings-example.tab_4') },
      { selector: 'tab5', caption: i18n.t('forms.components-examples.flexberry-tab-bar.settings-example.tab_5') },
      { selector: 'tab6', caption: i18n.t('forms.components-examples.flexberry-tab-bar.settings-example.tab_6') },
      { selector: 'tab7', caption: i18n.t('forms.components-examples.flexberry-tab-bar.settings-example.tab_7') },
      { selector: 'tab8', caption: i18n.t('forms.components-examples.flexberry-tab-bar.settings-example.tab_8') },
      { selector: 'tab9', caption: i18n.t('forms.components-examples.flexberry-tab-bar.settings-example.tab_9') },
      { selector: 'tab10', caption: i18n.t('forms.components-examples.flexberry-tab-bar.settings-example.tab_10') },
      { selector: 'tab11', caption: i18n.t('forms.components-examples.flexberry-tab-bar.settings-example.tab_11') },
      { selector: 'tab12', caption: i18n.t('forms.components-examples.flexberry-tab-bar.settings-example.tab_12') },
      { selector: 'tab13', caption: i18n.t('forms.components-examples.flexberry-tab-bar.settings-example.tab_13') },
      { selector: 'tab14', caption: i18n.t('forms.components-examples.flexberry-tab-bar.settings-example.tab_14') },
      { selector: 'tab15', caption: i18n.t('forms.components-examples.flexberry-tab-bar.settings-example.tab_15') }
    ];
  }),

  /**
    Template text for 'flexberry-textbox' component.

    @property componentTemplateText
    @type String
  */
  componentTemplateText: undefined,
  
  init() {
    this._super(...arguments);
    this.set('componentTemplateText', new htmlSafe(
      '{{#flexberry-tab-bar<br>' +
      '  items=items<br>' +
      '  isOverflowedTabs=isOverflowedTabs<br>' +
      '}}<br>' +
      '{{/flexberry-tab-bar}}'));
  },

  /**
    Component settings metadata.
    @property componentSettingsMetadata
    @type Object[]
  */
  componentSettingsMetadata: computed('i18n.locale', function() {
    let componentSettingsMetadata = A();

    componentSettingsMetadata.pushObject({
      settingName: 'isOverflowedTabs',
      settingType: 'boolean',
      settingDefaultValue: false,
      bindedControllerPropertieName: 'isOverflowedTabs'
    });
    return componentSettingsMetadata;
  }),

  actions: {
    reloadTabs(){
      this.set('reloadTabs', false);
      next(() => {
        this.set('reloadTabs', true);
      })
    }
  }
});

