import Ember from 'ember';
import config from '../config/environment';

const version = config.APP.version;

export default Ember.Controller.extend({
  actions: {
    /**
      Toggles application sitemap's side bar.

      @method actions.toggleSidebar
    */
    toggleSidebar() {
      let sidebar = Ember.$('.ui.sidebar.main.menu');
      sidebar.sidebar({
        closable: false,
        dimPage: false,
        onHide: function() {
          Ember.$('.sidebar.icon.text-menu-1').removeClass('hidden-menu');
          Ember.$('.sidebar.icon.text-menu-2').addClass('hidden-menu');
        }
      }).sidebar('toggle');

      if (Ember.$('.inverted.vertical.main.menu').hasClass('visible')) {
        Ember.$('.sidebar.icon.text-menu-1').removeClass('hidden-menu');
        Ember.$('.sidebar.icon.text-menu-2').addClass('hidden-menu');
        Ember.$('.bgw-opacity').addClass('hidden');
      } else {
        Ember.$('.sidebar.icon.text-menu-1').addClass('hidden-menu');
        Ember.$('.sidebar.icon.text-menu-2').removeClass('hidden-menu');
        Ember.$('.bgw-opacity').removeClass('hidden');
      }

      if (Ember.$('.inverted.vertical.main.menu').hasClass('visible')) {
        Ember.$('.full.height').css({'transition': 'width 0.45s ease-in-out 0s', 'width': '100%'});
      } else {
        Ember.$('.full.height').css({'transition': 'width 0.3s ease-in-out 0s', 'width': 'calc(100% - ' + sidebar.width() + 'px)'});
      }
    },

    /**
      Toggles application sitemap's side bar in mobile view.

      @method actions.toggleSidebarMobile
    */
    toggleSidebarMobile() {
      let sidebar = Ember.$('.ui.sidebar.main.menu');
      sidebar.sidebar({
        onHide: function() {
          Ember.$('.sidebar.icon.text-menu-1').removeClass('hidden-menu');
          Ember.$('.sidebar.icon.text-menu-2').addClass('hidden-menu');
        }
      }).sidebar('toggle');

      if (Ember.$('.inverted.vertical.main.menu').hasClass('visible')) {
        Ember.$('.sidebar.icon.text-menu-1').removeClass('hidden-menu');
        Ember.$('.sidebar.icon.text-menu-2').addClass('hidden-menu');
        Ember.$('.bgw-opacity').addClass('hidden');
      } else {
        Ember.$('.sidebar.icon.text-menu-1').addClass('hidden-menu');
        Ember.$('.sidebar.icon.text-menu-2').removeClass('hidden-menu');
        Ember.$('.bgw-opacity').removeClass('hidden');
      }
    }
  },

  /**
    Flag: indicates that form to which controller is related designed for acceptance tests &
    all additional markup in application.hbs mustn't be rendered.

    @property isInAcceptanceTestMode
    @type Boolean
    @default false
  */
  isInAcceptanceTestMode: false,

  /**
    Currernt addon version.

    @property addonVersion
    @type String
  */
  addonVersion: version,

  /**
    Link to GitHub commit related to current addon version.

    @property addonVersionHref
    @type String
  */
  addonVersionHref: Ember.computed('addonVersion', function() {
    let addonVersion = this.get('addonVersion');
    let commitSha = addonVersion.split('+')[1];

    return 'https://github.com/Flexberry/ember-flexberry/commit/' + commitSha;
  }),

  /**
    Flag: indicates whether current browser is internet explorer.

    @property browserIsInternetExplorer
    @type Boolean
  */
  browserIsInternetExplorer: Ember.computed(function() {
    let userAgent = window.navigator.userAgent;

    return userAgent.indexOf('MSIE ') > 0 || userAgent.indexOf('Trident/') > 0 || userAgent.indexOf('Edge/') > 0;
  }),

  /**
    Locales supported by application.

    @property locales
    @type String[]
    @default ['ru', 'en']
  */
  locales: ['ru', 'en'],

  /**
    Handles changes in userSettingsService.isUserSettingsServiceEnabled.

    @method _userSettingsServiceChanged
    @private
  */
  _userSettingsServiceChanged: Ember.observer('userSettingsService.isUserSettingsServiceEnabled', function() {
    this.get('target.router').refresh();
  }),

  /**
    Initializes controller.
  */
  init() {
    this._super(...arguments);

    let i18n = this.get('i18n');
    if (Ember.isNone(i18n)) {
      return;
    }

    // If i18n.locale is long value like 'ru-RU', 'en-GB', ... this code will return short variant 'ru', 'en', etc.
    let shortCurrentLocale = this.get('i18n.locale').split('-')[0];
    let availableLocales = Ember.A(this.get('locales'));

    // Force current locale to be one of available,
    // if browser's current language is not supported by dummy application,
    // or if browser's current locale is long value like 'ru-RU', 'en-GB', etc.
    if (!availableLocales.contains(shortCurrentLocale)) {
      i18n.set('locale', 'en');
    } else {
      i18n.set('locale', shortCurrentLocale);
    }
  },

  /**
    Application sitemap.

    @property sitemap
    @type Object
  */
  sitemap: Ember.computed('i18n.locale', function() {
    let i18n = this.get('i18n');

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
        caption: i18n.t('forms.application.sitemap.log-service-examples.caption'),
        title: i18n.t('forms.application.sitemap.log-service-examples.title'),
        children: [{
          link: 'i-i-s-caseberry-logging-objects-application-log-l',
          caption: i18n.t('forms.application.sitemap.log-service-examples.application-log.caption'),
          title: i18n.t('forms.application.sitemap.log-service-examples.application-log.title'),
          children: null
        }, {
          link: 'log-service-examples/settings-example',
          caption: i18n.t('forms.application.sitemap.log-service-examples.settings-example.caption'),
          title: i18n.t('forms.application.sitemap.log-service-examples.settings-example.title'),
          children: null
        }, {
          link: 'log-service-examples/clear-log-form',
          caption: i18n.t('forms.application.sitemap.log-service-examples.clear-log-form.caption'),
          title: i18n.t('forms.application.sitemap.log-service-examples.clear-log-form.title'),
          children: null
        }]
      }, {
        link: null,
        caption: i18n.t('forms.application.sitemap.lock.caption'),
        title: i18n.t('forms.application.sitemap.lock.caption'),
        children: [{
          link: 'new-platform-flexberry-services-lock-list',
          caption: i18n.t('forms.application.sitemap.lock.title'),
          title: i18n.t('forms.application.sitemap.lock.title'),
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
          caption: i18n.t('forms.application.sitemap.components-examples.flexberry-datepicker.caption'),
          title: i18n.t('forms.application.sitemap.components-examples.flexberry-datepicker.title'),
          children: [{
            link: 'components-examples/flexberry-datepicker/settings-example',
            caption: i18n.t('forms.application.sitemap.components-examples.flexberry-datepicker.settings-example.caption'),
            title: i18n.t('forms.application.sitemap.components-examples.flexberry-datepicker.settings-example.title'),
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
          }, {
            link: 'components-examples/flexberry-dropdown/empty-value-example',
            caption: i18n.t('forms.application.sitemap.components-examples.flexberry-dropdown.empty-value-example.caption'),
            title: i18n.t('forms.application.sitemap.components-examples.flexberry-dropdown.empty-value-example.title'),
            children: null
          }, {
            link: 'components-examples/flexberry-dropdown/items-example',
            caption: i18n.t('forms.application.sitemap.components-examples.flexberry-dropdown.items-example.caption'),
            title: i18n.t('forms.application.sitemap.components-examples.flexberry-dropdown.items-example.title'),
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
          caption: i18n.t('forms.application.sitemap.components-examples.flexberry-file.caption'),
          title: i18n.t('forms.application.sitemap.components-examples.flexberry-file.title'),
          children: [{
            link: 'components-examples/flexberry-file/settings-example',
            caption: i18n.t('forms.application.sitemap.components-examples.flexberry-file.settings-example.caption'),
            title: i18n.t('forms.application.sitemap.components-examples.flexberry-file.settings-example.title'),
            children: null
          }]
        }, {
          link: null,
          caption: i18n.t('forms.application.sitemap.components-examples.flexberry-groupedit.caption'),
          title: i18n.t('forms.application.sitemap.components-examples.flexberry-groupedit.title'),
          children: [{
            link: 'components-examples/flexberry-groupedit/model-update-example',
            caption: i18n.t('forms.application.sitemap.components-examples.flexberry-groupedit.model-update-example.caption'),
            title: i18n.t('forms.application.sitemap.components-examples.flexberry-groupedit.model-update-example.title'),
            children: null
          }, {
            link: 'components-examples/flexberry-groupedit/settings-example',
            caption: i18n.t('forms.application.sitemap.components-examples.flexberry-groupedit.settings-example.caption'),
            title: i18n.t('forms.application.sitemap.components-examples.flexberry-groupedit.settings-example.title'),
            children: null
          }, {
            link: 'components-examples/flexberry-groupedit/configurate-row-example',
            caption: i18n.t('forms.application.sitemap.components-examples.flexberry-groupedit.configurate-row-example.caption'),
            title: i18n.t('forms.application.sitemap.components-examples.flexberry-groupedit.configurate-row-example.title'),
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
          }, {
            link: 'components-examples/flexberry-lookup/customizing-window-example',
            caption: i18n.t('forms.application.sitemap.components-examples.flexberry-lookup.customizing-window-example.caption'),
            title: i18n.t('forms.application.sitemap.components-examples.flexberry-lookup.customizing-window-example.title'),
            children: null
          }, {
            link: 'components-examples/flexberry-lookup/limit-function-example',
            caption: i18n.t('forms.application.sitemap.components-examples.flexberry-lookup.limit-function-example.caption'),
            title: i18n.t('forms.application.sitemap.components-examples.flexberry-lookup.limit-function-example.title'),
            children: null
          }, {
            link: 'components-examples/flexberry-lookup/limit-function-through-dynamic-properties-example',
            caption: i18n.t('forms.application.sitemap.components-examples.flexberry-lookup.limit-function-through-dynamic-properties-example.caption'),
            title: i18n.t('forms.application.sitemap.components-examples.flexberry-lookup.limit-function-through-dynamic-properties-example.title'),
            children: null
          }, {
            link: 'components-examples/flexberry-lookup/lookup-block-form-example',
            caption: i18n.t('forms.application.sitemap.components-examples.flexberry-lookup.lookup-block-form-example.caption'),
            title: i18n.t('forms.application.sitemap.components-examples.flexberry-lookup.lookup-block-form-example.title'),
            children: null
          }, {
            link: 'components-examples/flexberry-lookup/lookup-in-modal',
            caption: i18n.t('forms.application.sitemap.components-examples.flexberry-lookup.lookup-in-modal.caption'),
            title: i18n.t('forms.application.sitemap.components-examples.flexberry-lookup.lookup-in-modal.title'),
            children: null
          }, {
            link: 'components-examples/flexberry-lookup/dropdown-mode-example',
            caption: i18n.t('forms.application.sitemap.components-examples.flexberry-lookup.dropdown-mode-example.caption'),
            title: i18n.t('forms.application.sitemap.components-examples.flexberry-lookup.dropdown-mode-example.title'),
            children: null
          }, {
            link: 'components-examples/flexberry-lookup/default-ordering-example',
            caption: i18n.t('forms.application.sitemap.components-examples.flexberry-lookup.default-ordering-example.caption'),
            title: i18n.t('forms.application.sitemap.components-examples.flexberry-lookup.default-ordering-example.title'),
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
          caption: i18n.t('forms.application.sitemap.components-examples.flexberry-objectlistview.caption'),
          title: i18n.t('forms.application.sitemap.components-examples.flexberry-objectlistview.title'),
          children: [{
            link: 'components-examples/flexberry-objectlistview/limit-function-example',
            caption: i18n.t('forms.application.sitemap.components-examples.flexberry-objectlistview.limit-function-example.caption'),
            title: i18n.t('forms.application.sitemap.components-examples.flexberry-objectlistview.limit-function-example.title'),
            children: null
          }, {
            link: 'components-examples/flexberry-objectlistview/inheritance-models',
            caption: i18n.t('forms.application.sitemap.components-examples.flexberry-objectlistview.inheritance-models.caption'),
            title: i18n.t('forms.application.sitemap.components-examples.flexberry-objectlistview.inheritance-models.title'),
            children: null
          }, {
            link: 'components-examples/flexberry-objectlistview/settings-example',
            caption: i18n.t('forms.application.sitemap.components-examples.flexberry-objectlistview.settings-example.caption'),
            title: i18n.t('forms.application.sitemap.components-examples.flexberry-objectlistview.settings-example.title'),
            children: null
          }, {
            link: 'components-examples/flexberry-objectlistview/toolbar-custom-buttons-example',
            caption: i18n.t('forms.application.sitemap.components-examples.flexberry-objectlistview.toolbar-custom-buttons-example.caption'),
            title: i18n.t('forms.application.sitemap.components-examples.flexberry-objectlistview.toolbar-custom-buttons-example.title'),
            children: null
          }, {
            link: 'components-examples/flexberry-objectlistview/on-edit-form',
            caption: i18n.t('forms.application.sitemap.components-examples.flexberry-objectlistview.on-edit-form.caption'),
            title: i18n.t('forms.application.sitemap.components-examples.flexberry-objectlistview.on-edit-form.title'),
          }, {
            link: 'components-examples/flexberry-objectlistview/custom-filter',
            caption: i18n.t('forms.application.sitemap.components-examples.flexberry-objectlistview.custom-filter.caption'),
            title: i18n.t('forms.application.sitemap.components-examples.flexberry-objectlistview.custom-filter.title'),
            children: null
          }, {
          }, {
            link: 'components-examples/flexberry-objectlistview/edit-form-with-detail-list',
            caption: i18n.t('forms.application.sitemap.components-examples.flexberry-objectlistview.edit-form-with-detail-list.caption'),
            title: i18n.t('forms.application.sitemap.components-examples.flexberry-objectlistview.edit-form-with-detail-list.title'),
            children: null
          }, {
            link: 'components-examples/flexberry-objectlistview/hierarchy-example',
            caption: i18n.t('forms.application.sitemap.components-examples.flexberry-objectlistview.hierarchy-example.caption'),
            title: i18n.t('forms.application.sitemap.components-examples.flexberry-objectlistview.hierarchy-example.title'),
            children: null
          }, {
            link: 'components-examples/flexberry-objectlistview/configurate-rows',
            caption: i18n.t('forms.application.sitemap.components-examples.flexberry-objectlistview.configurate-rows.caption'),
            title: i18n.t('forms.application.sitemap.components-examples.flexberry-objectlistview.configurate-rows.title'),
            children: null
          }, {
            link: 'components-examples/flexberry-objectlistview/downloading-files-from-olv-list',
            caption: i18n.t('forms.application.sitemap.components-examples.flexberry-objectlistview.downloading-files-from-olv-list.caption'),
            title: i18n.t('forms.application.sitemap.components-examples.flexberry-objectlistview.downloading-files-from-olv-list.title'),
            children: null
          }, {
            link: 'components-examples/flexberry-objectlistview/selected-rows',
            caption: i18n.t('forms.application.sitemap.components-examples.flexberry-objectlistview.selected-rows.caption'),
            title: i18n.t('forms.application.sitemap.components-examples.flexberry-objectlistview.selected-rows.title'),
            children: null
          }, {
            link: 'components-examples/flexberry-objectlistview/object-list-view-resize',
            caption: i18n.t('forms.application.sitemap.components-examples.flexberry-objectlistview.object-list-view-resize.caption'),
            title: i18n.t('forms.application.sitemap.components-examples.flexberry-objectlistview.object-list-view-resize.title'),
            children: null
          }]
        }, {
          link: null,
          caption: 'flexberry-simpleolv',
          title: i18n.t('forms.application.sitemap.components-examples.flexberry-objectlistview.title'),
          children: [{
            link: 'components-examples/flexberry-simpleolv/limit-function-example',
            caption: i18n.t('forms.application.sitemap.components-examples.flexberry-objectlistview.limit-function-example.caption'),
            title: i18n.t('forms.application.sitemap.components-examples.flexberry-objectlistview.limit-function-example.title'),
            children: null
          }, {
            link: 'components-examples/flexberry-simpleolv/settings-example',
            caption: i18n.t('forms.application.sitemap.components-examples.flexberry-objectlistview.settings-example.caption'),
            title: i18n.t('forms.application.sitemap.components-examples.flexberry-objectlistview.settings-example.title'),
            children: null
          }, {
            link: 'components-examples/flexberry-simpleolv/toolbar-custom-buttons-example',
            caption: i18n.t('forms.application.sitemap.components-examples.flexberry-objectlistview.toolbar-custom-buttons-example.caption'),
            title: i18n.t('forms.application.sitemap.components-examples.flexberry-objectlistview.toolbar-custom-buttons-example.title'),
            children: null
          }, {
            link: 'components-examples/flexberry-simpleolv/on-edit-form',
            caption: i18n.t('forms.application.sitemap.components-examples.flexberry-objectlistview.on-edit-form.caption'),
            title: i18n.t('forms.application.sitemap.components-examples.flexberry-objectlistview.on-edit-form.title'),
          }, {
            link: 'components-examples/flexberry-simpleolv/custom-filter',
            caption: i18n.t('forms.application.sitemap.components-examples.flexberry-objectlistview.custom-filter.caption'),
            title: i18n.t('forms.application.sitemap.components-examples.flexberry-objectlistview.custom-filter.title'),
            children: null
          }, {
            link: 'components-examples/flexberry-simpleolv/configurate-rows',
            caption: i18n.t('forms.application.sitemap.components-examples.flexberry-objectlistview.configurate-rows.caption'),
            title: i18n.t('forms.application.sitemap.components-examples.flexberry-objectlistview.configurate-rows.title'),
            children: null
          }, {
            link: 'components-examples/flexberry-simpleolv/selected-rows',
            caption: i18n.t('forms.application.sitemap.components-examples.flexberry-objectlistview.selected-rows.caption'),
            title: i18n.t('forms.application.sitemap.components-examples.flexberry-objectlistview.selected-rows.title'),
            children: null
          }]
        }, {
          link: null,
          caption: i18n.t('forms.application.sitemap.components-examples.flexberry-simpledatetime.caption'),
          title: i18n.t('forms.application.sitemap.components-examples.flexberry-simpledatetime.title'),
          children: [{
            link: 'components-examples/flexberry-simpledatetime/settings-example',
            caption: i18n.t('forms.application.sitemap.components-examples.flexberry-simpledatetime.settings-example.caption'),
            title: i18n.t('forms.application.sitemap.components-examples.flexberry-simpledatetime.settings-example.title'),
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
        }, {
          link: null,
          caption: i18n.t('forms.application.sitemap.components-examples.flexberry-toggler.caption'),
          title: i18n.t('forms.application.sitemap.components-examples.flexberry-toggler.title'),
          children: [{
            link: 'components-examples/flexberry-toggler/settings-example',
            caption: i18n.t('forms.application.sitemap.components-examples.flexberry-toggler.settings-example.caption'),
            title: i18n.t('forms.application.sitemap.components-examples.flexberry-toggler.settings-example.title'),
            children: null
          }]
        }, {
          link: null,
          caption: i18n.t('forms.application.sitemap.components-examples.ui-message.caption'),
          title: i18n.t('forms.application.sitemap.components-examples.ui-message.title'),
          children: [{
            link: 'components-examples/ui-message/settings-example',
            caption: i18n.t('forms.application.sitemap.components-examples.ui-message.settings-example.caption'),
            title: i18n.t('forms.application.sitemap.components-examples.ui-message.settings-example.title'),
            children: null
          }]
        }]
      }, {
        link: null,
        caption: i18n.t('forms.application.sitemap.integration-examples.caption'),
        title: i18n.t('forms.application.sitemap.integration-examples.title'),
        children: [{
          link: null,
          caption: i18n.t('forms.application.sitemap.integration-examples.edit-form.caption'),
          title: i18n.t('forms.application.sitemap.integration-examples.edit-form.title'),
          children: [{
            link: 'integration-examples/edit-form/readonly-mode',
            caption: i18n.t('forms.application.sitemap.integration-examples.edit-form.readonly-mode.caption'),
            title: i18n.t('forms.application.sitemap.integration-examples.edit-form.readonly-mode.title'),
            children: null
          }, {
            link: 'integration-examples/edit-form/validation',
            caption: i18n.t('forms.application.sitemap.integration-examples.edit-form.validation.caption'),
            title: i18n.t('forms.application.sitemap.integration-examples.edit-form.validation.title'),
            children: null
          }]
        }]
      }, {
        link: null,
        caption: i18n.t('forms.application.sitemap.user-setting-forms.caption'),
        title: i18n.t('forms.application.sitemap.user-setting-forms.title'),
        children: [{
          link: 'user-setting-forms/user-setting-delete',
          caption: i18n.t('forms.application.sitemap.user-setting-forms.user-setting-delete.caption'),
          title: i18n.t('forms.application.sitemap.user-setting-forms.user-setting-delete.title'),
          children: null
        }]
      }]
    };
  })
});
