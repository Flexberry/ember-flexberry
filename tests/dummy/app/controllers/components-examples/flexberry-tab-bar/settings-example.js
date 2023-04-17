import Ember from 'ember';
import { htmlSafe } from '@ember/string';
import { computed } from '@ember/object';

export default Ember.Controller.extend({
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
      '}}<br>' +
      '{{/flexberry-tab-bar}}'));
  },

  actions: {
    }
});

