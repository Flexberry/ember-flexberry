import Ember from 'ember';
import config from '../config/environment';

const version = config.APP.version;

export default Ember.Controller.extend({
  actions: {
    onLocaleChange(newLocale) {
      this.get('i18n').set('locale', newLocale);
    },

    toggleSidebar(direction) {
      Ember.$('.ui.sidebar').sidebar('toggle');
    }
  },

  /**
   * Currernt addon version.
   *
   * @property addonVersion
   * @type String
   */
  addonVersion: version,

  /**
   * Link to GitHub commit related to current addon version.
   *
   * @property addonVersionHref
   * @type String
   */
  addonVersionHref: Ember.computed('addonVersion', function() {
    var addonVersion = this.get('addonVersion');
    var commitSha = addonVersion.split('+')[1];

    return 'https://github.com/Flexberry/ember-flexberry/commit/' + commitSha;
  }),

  /**
   * Available test application locales.
   *
   * @property locales
   * @type String[]
   */
  locales: ['ru', 'en'],

  /**
   * Current application locale.
   *
   * @property currentLocale
   * @type String
   */
  currentLocale: Ember.computed('i18n.locale', function() {
    return this.get('i18n.locale');
  }),

  /**
   * Application sitemap.
   *
   * @property sitemap
   * @type Object
   */
  sitemap: Ember.computed('i18n.locale', function() {
    var i18n = this.get('i18n');

    return {
      nodes: [{
        link: 'index',
        caption: i18n.t('forms.application.sitemap.index.caption'),
        title: i18n.t('forms.application.sitemap.index.title'),
        children: null
      }, {
        link: null,
        caption: i18n.t('forms.application.sitemap.application.caption'),
        title: i18n.t('forms.application.sitemap.application.title'),
        children: [{
          link: 'ember-flexberry-dummy-application-user-list',
          caption: i18n.t('forms.application.sitemap.application.application-users.caption'),
          title: i18n.t('forms.application.sitemap.application.application-users.title'),
          children: null
        }, {
          link: 'ember-flexberry-dummy-localization-list',
          caption: i18n.t('forms.application.sitemap.application.localizations.caption'),
          title: i18n.t('forms.application.sitemap.application.localizations.title'),
          children: null
        }, {
          link: 'ember-flexberry-dummy-suggestion-list',
          caption: i18n.t('forms.application.sitemap.application.suggestions.caption'),
          title: i18n.t('forms.application.sitemap.application.suggestions.title'),
          children: null
        }, {
          link: 'ember-flexberry-dummy-suggestion-type-list',
          caption: i18n.t('forms.application.sitemap.application.suggestion-types.caption'),
          title: i18n.t('forms.application.sitemap.application.suggestion-types.title'),
          children: null
        }]
      }, {
        link: null,
        caption: i18n.t('forms.application.sitemap.components-examples.caption'),
        title: i18n.t('forms.application.sitemap.components-examples.title'),
        children: [{
          link: null,
          caption: i18n.t('forms.application.sitemap.components-examples.flexberry-checkbox.caption'),
          title: i18n.t('forms.application.sitemap.components-examples.flexberry-checkbox.title'),
          children: [{
            link: 'components-examples/flexberry-checkbox/settings-example',
            caption: i18n.t('forms.application.sitemap.components-examples.flexberry-checkbox.settings-example.caption'),
            title: i18n.t('forms.application.sitemap.components-examples.flexberry-checkbox.settings-example.title'),
            children: null
          }]
        }, {
          link: null,
          caption: i18n.t('forms.application.sitemap.components-examples.flexberry-dropdown.caption'),
          title: i18n.t('forms.application.sitemap.components-examples.flexberry-dropdown.title'),
          children: [{
            link: 'components-examples/flexberry-dropdown/settings-example',
            caption: i18n.t('forms.application.sitemap.components-examples.flexberry-dropdown.settings-example.caption'),
            title: i18n.t('forms.application.sitemap.components-examples.flexberry-dropdown.settings-example.title'),
            children: null
          }, {
            link: 'components-examples/flexberry-dropdown/conditional-render-example',
            caption: i18n.t('forms.application.sitemap.components-examples.flexberry-dropdown.conditional-render-example.caption'),
            title: i18n.t('forms.application.sitemap.components-examples.flexberry-dropdown.conditional-render-example.title'),
            children: null
          }]
        }, {
          link: null,
          caption: i18n.t('forms.application.sitemap.components-examples.flexberry-field.caption'),
          title: i18n.t('forms.application.sitemap.components-examples.flexberry-field.title'),
          children: [{
            link: 'components-examples/flexberry-field/settings-example',
            caption: i18n.t('forms.application.sitemap.components-examples.flexberry-field.settings-example.caption'),
            title: i18n.t('forms.application.sitemap.components-examples.flexberry-field.settings-example.title'),
            children: null
          }]
        }, {
          link: null,
          caption: i18n.t('forms.application.sitemap.components-examples.flexberry-groupedit.caption'),
          title: i18n.t('forms.application.sitemap.components-examples.flexberry-groupedit.title'),
          children: [{
            link: 'components-examples/flexberry-groupedit/settings-example',
            caption: i18n.t('forms.application.sitemap.components-examples.flexberry-groupedit.settings-example.caption'),
            title: i18n.t('forms.application.sitemap.components-examples.flexberry-groupedit.settings-example.title'),
            children: null
          }]
        }, {
          link: null,
          caption: i18n.t('forms.application.sitemap.components-examples.flexberry-lookup.caption'),
          title: i18n.t('forms.application.sitemap.components-examples.flexberry-lookup.title'),
          children: [{
            link: 'components-examples/flexberry-lookup/settings-example',
            caption: i18n.t('forms.application.sitemap.components-examples.flexberry-lookup.settings-example.caption'),
            title: i18n.t('forms.application.sitemap.components-examples.flexberry-lookup.settings-example.title'),
            children: null
          }]
        }, {
          link: null,
          caption: i18n.t('forms.application.sitemap.components-examples.flexberry-menu.caption'),
          title: i18n.t('forms.application.sitemap.components-examples.flexberry-menu.title'),
          children: [{
            link: 'components-examples/flexberry-menu/settings-example',
            caption: i18n.t('forms.application.sitemap.components-examples.flexberry-menu.settings-example.caption'),
            title: i18n.t('forms.application.sitemap.components-examples.flexberry-menu.settings-example.title'),
            children: null
          }]
        }, {
          link: null,
          caption: i18n.t('forms.application.sitemap.components-examples.flexberry-textarea.caption'),
          title: i18n.t('forms.application.sitemap.components-examples.flexberry-textarea.title'),
          children: [{
            link: 'components-examples/flexberry-textarea/settings-example',
            caption: i18n.t('forms.application.sitemap.components-examples.flexberry-textarea.settings-example.caption'),
            title: i18n.t('forms.application.sitemap.components-examples.flexberry-textarea.settings-example.title'),
            children: null
          }]
        }, {
          link: null,
          caption: i18n.t('forms.application.sitemap.components-examples.flexberry-textbox.caption'),
          title: i18n.t('forms.application.sitemap.components-examples.flexberry-textbox.title'),
          children: [{
            link: 'components-examples/flexberry-textbox/settings-example',
            caption: i18n.t('forms.application.sitemap.components-examples.flexberry-textbox.settings-example.caption'),
            title: i18n.t('forms.application.sitemap.components-examples.flexberry-textbox.settings-example.title'),
            children: null
          }]
        }]
      }]
    };
  })
});
