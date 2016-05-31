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
        title: i18n.t('site-map.home.title'),
        children: null
      }, {
        link: null,
        title: i18n.t('site-map.application.title'),
        children: [{
          link: 'ember-flexberry-dummy-application-user-list',
          title: i18n.t('site-map.application-users.title'),
          children: null
        }, {
          link: 'ember-flexberry-dummy-localization-list',
          title: i18n.t('site-map.localizations.title'),
          children: null
        }, {
          link: 'ember-flexberry-dummy-suggestion-type-list',
          title: i18n.t('site-map.suggestion-types.title'),
          children: null
        }, {
          link: 'ember-flexberry-dummy-suggestion-list',
          title: i18n.t('site-map.suggestions.title'),
          children: null
        }]
      }, {
        link: null,
        title: i18n.t('site-map.components-examples.title'),
        children: [{
          link: null,
          title: 'flexberry-checkbox',
          children: [{
            link: 'components-examples/flexberry-checkbox/settings-example',
            title: i18n.t('site-map.components-examples.flexberry-checkbox.settings-example.title'),
            children: null
          }]
        }, {
          link: null,
          title: 'flexberry-dropdown',
          children: [{
            link: 'components-examples/flexberry-dropdown/settings-example',
            title: i18n.t('site-map.components-examples.flexberry-dropdown.settings-example.title'),
            children: null
          }, {
            link: 'components-examples/flexberry-dropdown/conditional-render-example',
            title: i18n.t('site-map.components-examples.flexberry-dropdown.conditional-render-example.title'),
            children: null
          }]
        }, {
          link: null,
          title: 'flexberry-menu',
          children: [{
            link: 'components-examples/flexberry-menu/settings-example',
            title: i18n.t('site-map.components-examples.flexberry-menu.settings-example.title'),
            children: null
          }]
        }, {
          link: null,
          title: 'flexberry-lookup',
          children: [{
            link: 'components-examples/flexberry-lookup/settings-example',
            title: i18n.t('site-map.components-examples.flexberry-lookup.settings-example.title'),
            children: null
          }]
        }, {
          link: null,
          title: 'flexberry-groupedit',
          children: [{
            link: 'components-examples/flexberry-groupedit/settings-example',
            title: i18n.t('site-map.components-examples.flexberry-groupedit.settings-example.title'),
            children: null
          }]
        }]
      }]
    };
  })
});
