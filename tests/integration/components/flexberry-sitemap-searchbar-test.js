import { module, test } from 'qunit';
import hbs from 'htmlbars-inline-precompile';
import Component from "@ember/component";
import { inject as service } from "@ember/service";
import I18nService from 'ember-i18n/services/i18n';
import I18nRuLocale from 'ember-flexberry/locales/ru/translations';
import I18nEnLocale from 'ember-flexberry/locales/en/translations';
import { render, fillIn, settled } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-qunit';

  let app;

  module('Integration | Component | flexberry-sitemap-searchbar', function(hooks) {
    setupRenderingTest(hooks);

    hooks.beforeEach( function () {
      this.owner.register('locale:ru/translations', I18nRuLocale);
      this.owner.register('locale:en/translations', I18nEnLocale);
      this.owner.register('service:i18n', I18nService);

      // Set 'ru' as initial locale.
      this.i18n = this.owner.lookup('service:i18n');
      //this.owner.inject('component', 'i18n', 'service:i18n');

      // Set 'ru' as initial locale.
      //this.i18n = this.owner.lookup('service:i18n');
      //this.i18n.set('locale', 'ru');

      Component.reopen({
        i18n: service('i18n')
      });
    
      // Установка начальной локали 'ru'
      this.i18n.set('locale', 'ru');
      /**
        @description Application sitemap.
        @property sitemap
        @type Object
      */
      this._sitemap = function() {
        let i18n = this.get('i18n');
        return {
          nodes: [{
            link: 'index',
            caption: i18n.t('forms.application.sitemap.index.caption'),
            title: i18n.t(I18nRuLocale,'forms.application.sitemap.index.title'),
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
          }, {
            link: 'ember-flexberry-dummy-multi-list',
            caption: i18n.t('forms.application.sitemap.application.multi.caption'),
            title: i18n.t('forms.application.sitemap.application.multi.title'),
            children: null
          }, {
            link: 'ember-flexberry-dummy-suggestion-file-list',
            caption: i18n.t('forms.application.sitemap.application.suggestion-file.caption'),
            title: i18n.t('forms.application.sitemap.application.suggestion-file.title'),
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
            caption: i18n.t('forms.application.sitemap.components-examples.flexberry-button.caption'),
            title: i18n.t('forms.application.sitemap.components-examples.flexberry-button.title'),
            children: [{
              link: 'components-examples/flexberry-button/settings-example',
              caption: i18n.t('forms.application.sitemap.components-examples.flexberry-button.settings-example.caption'),
              title: i18n.t('forms.application.sitemap.components-examples.flexberry-button.settings-example.title'),
              children: null
            }]
          }, {
            link: null,
            caption: i18n.t('forms.application.sitemap.components-examples.flexberry-checkbox.caption'),
            title: i18n.t('forms.application.sitemap.components-examples.flexberry-checkbox.title'),
            children: [{
              link: 'components-examples/flexberry-checkbox/settings-example',
              caption: i18n.t('forms.application.sitemap.components-examples.flexberry-checkbox.settings-example.caption'),
              title: i18n.t('forms.application.sitemap.components-examples.flexberry-checkbox.settings-example.title'),
              children: null
            }, {
              link: 'components-examples/flexberry-checkbox/three-state-example',
              caption: i18n.t('forms.application.sitemap.components-examples.flexberry-checkbox.three-state-example.caption'),
              title: i18n.t('forms.application.sitemap.components-examples.flexberry-checkbox.three-state-example.title'),
              children: null
            }]
          }, {
            link: null,
            caption: i18n.t('forms.application.sitemap.components-examples.flexberry-ddau-checkbox.caption'),
            title: i18n.t('forms.application.sitemap.components-examples.flexberry-ddau-checkbox.title'),
            children: [{
              link: 'components-examples/flexberry-ddau-checkbox/settings-example',
              caption: i18n.t('forms.application.sitemap.components-examples.flexberry-ddau-checkbox.settings-example.caption'),
              title: i18n.t('forms.application.sitemap.components-examples.flexberry-ddau-checkbox.settings-example.title'),
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
            }, {
              link: 'components-examples/flexberry-file/flexberry-file-in-modal',
              caption: i18n.t('forms.application.sitemap.components-examples.flexberry-file.flexberry-file-in-modal.caption'),
              title: i18n.t('forms.application.sitemap.components-examples.flexberry-file.flexberry-file-in-modal.title'),
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
              link: 'components-examples/flexberry-groupedit/custom-buttons-example',
              caption: i18n.t('forms.application.sitemap.components-examples.flexberry-groupedit.custom-buttons-example.caption'),
              title: i18n.t('forms.application.sitemap.components-examples.flexberry-groupedit.custom-buttons-example.title'),
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
            }, {
              link: 'components-examples/flexberry-groupedit/ember-flexberry-dummy-suggestion-list-groupedit-with-lookup-with-computed-atribute',
              caption: i18n.t('forms.application.sitemap.components-examples.flexberry-groupedit.groupedit-with-lookup-with-computed-atribute.caption'),
              title: i18n.t('forms.application.sitemap.components-examples.flexberry-groupedit.groupedit-with-lookup-with-computed-atribute.title'),
              children: null
            }, {
              link: 'components-examples/flexberry-groupedit/ember-flexberry-dummy-suggestion-list-readonly-columns-by-configurate-row-example',
              caption: i18n.t('forms.application.sitemap.components-examples.flexberry-groupedit.readonly-columns-by-configurate-row-example.caption'),
              title: i18n.t('forms.application.sitemap.components-examples.flexberry-groupedit.readonly-columns-by-configurate-row-example.title'),
              children: null
            }, {
              link: 'components-examples/flexberry-groupedit/field-readonly-status-depend-on-another-field-value',
              caption: i18n.t('forms.application.sitemap.components-examples.flexberry-groupedit.field-readonly-status-depend-on-another-field-value.caption'),
              title: i18n.t('forms.application.sitemap.components-examples.flexberry-groupedit.field-readonly-status-depend-on-another-field-value.title'),
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
              link: 'components-examples/flexberry-lookup/hierarchy-olv-in-lookup-example',
              caption: i18n.t('forms.application.sitemap.components-examples.flexberry-lookup.hierarchy-olv-in-lookup-example.caption'),
              title: i18n.t('forms.application.sitemap.components-examples.flexberry-lookup.hierarchy-olv-in-lookup-example.title'),
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
            }, {
              link: 'components-examples/flexberry-lookup/autocomplete-order-example',
              caption: i18n.t('forms.application.sitemap.components-examples.flexberry-lookup.autocomplete-order-example.caption'),
              title: i18n.t('forms.application.sitemap.components-examples.flexberry-lookup.autocomplete-order-example.title'),
              children: null
            }, {
              link: 'components-examples/flexberry-lookup/compute-autocomplete/compute-autocomplete-list',
              caption: i18n.t('forms.application.sitemap.components-examples.flexberry-lookup.compute-autocomplete.caption'),
              title: i18n.t('forms.application.sitemap.components-examples.flexberry-lookup.compute-autocomplete.title'),
              children: null
            }, {
              link: 'components-examples/flexberry-lookup/numeric-autocomplete',
              caption: i18n.t('forms.application.sitemap.components-examples.flexberry-lookup.numeric-autocomplete.caption'),
              title: i18n.t('forms.application.sitemap.components-examples.flexberry-lookup.numeric-autocomplete.title'),
              children: null
            }, {
              link: 'components-examples/flexberry-lookup/autofill-by-limit-example',
              caption: i18n.t('forms.application.sitemap.components-examples.flexberry-lookup.autofill-by-limit-example.caption'),
              title: i18n.t('forms.application.sitemap.components-examples.flexberry-lookup.autofill-by-limit-example.title'),
              children: null
            }, {
              link: 'components-examples/flexberry-lookup/user-settings-example',
              caption: i18n.t('forms.application.sitemap.components-examples.flexberry-lookup.user-settings-example.caption'),
              title: i18n.t('forms.application.sitemap.components-examples.flexberry-lookup.user-settings-example.title'),
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
              link: 'components-examples/flexberry-objectlistview/list-on-editform',
              caption: i18n.t('forms.application.sitemap.components-examples.flexberry-objectlistview.list-on-editform.caption'),
              title: i18n.t('forms.application.sitemap.components-examples.flexberry-objectlistview.list-on-editform.title'),
            }, {
              link: 'components-examples/flexberry-objectlistview/custom-filter',
              caption: i18n.t('forms.application.sitemap.components-examples.flexberry-objectlistview.custom-filter.caption'),
              title: i18n.t('forms.application.sitemap.components-examples.flexberry-objectlistview.custom-filter.title'),
              children: null
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
              link: 'components-examples/flexberry-objectlistview/hierarchy-paging-example',
              caption: i18n.t('forms.application.sitemap.components-examples.flexberry-objectlistview.hierarchy-paging-example.caption'),
              title: i18n.t('forms.application.sitemap.components-examples.flexberry-objectlistview.hierarchy-paging-example.title'),
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
            }, {
              link: 'components-examples/flexberry-objectlistview/return-with-query-params/ember-flexberry-dummy-suggestion-return-with-query-params-list',
              caption: i18n.t('forms.application.sitemap.components-examples.flexberry-objectlistview.return-from-ediform.title'),
              title: i18n.t('forms.application.sitemap.components-examples.flexberry-objectlistview.return-from-ediform.title'),
              children: null
            }, {
              link: 'components-examples/flexberry-objectlistview/lock-services-editor-view-list',
              caption: i18n.t('forms.application.sitemap.components-examples.flexberry-objectlistview.lock-services-editor-view-list.caption'),
              title: i18n.t('forms.application.sitemap.components-examples.flexberry-objectlistview.lock-services-editor-view-list.title'),
              children: null
            }, {
              link: 'components-examples/flexberry-objectlistview/limited-text-size-example',
              caption: i18n.t('forms.application.sitemap.components-examples.flexberry-objectlistview.limited-text-size-example.caption'),
              title: i18n.t('forms.application.sitemap.components-examples.flexberry-objectlistview.limited-text-size-example.title'),
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
            caption: i18n.t('forms.application.sitemap.components-examples.flexberry-text-cell.caption'),
            title: i18n.t('forms.application.sitemap.components-examples.flexberry-text-cell.title'),
            children: [{
              link: 'components-examples/flexberry-text-cell/settings-example',
              caption: i18n.t('forms.application.sitemap.components-examples.flexberry-text-cell.settings-example.caption'),
              title: i18n.t('forms.application.sitemap.components-examples.flexberry-text-cell.settings-example.title'),
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
            }, {
              link: 'components-examples/flexberry-toggler/settings-example-inner',
              caption: i18n.t('forms.application.sitemap.components-examples.flexberry-toggler.settings-example-inner.caption'),
              title: i18n.t('forms.application.sitemap.components-examples.flexberry-toggler.settings-example-inner.title'),
              children: null
            }, {
              link: 'components-examples/flexberry-toggler/ge-into-toggler-example',
              caption: i18n.t('forms.application.sitemap.components-examples.flexberry-toggler.ge-into-toggler-example.caption'),
              title: i18n.t('forms.application.sitemap.components-examples.flexberry-toggler.ge-into-toggler-example.title'),
              children: null
            }]
          }, {
            link: null,
            caption: i18n.t('forms.application.sitemap.components-examples.flexberry-tree.caption'),
            title: i18n.t('forms.application.sitemap.components-examples.flexberry-tree.title'),
            children: [{
              link: 'components-examples/flexberry-tree/settings-example',
              caption: i18n.t('forms.application.sitemap.components-examples.flexberry-tree.settings-example.caption'),
              title: i18n.t('forms.application.sitemap.components-examples.flexberry-tree.settings-example.title'),
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
          }, {
            link: null,
            caption: i18n.t('forms.application.sitemap.integration-examples.odata-examples.caption'),
            title: i18n.t('forms.application.sitemap.integration-examples.odata-examples.title'),
            children: [{
              link: null,
              caption: i18n.t('forms.application.sitemap.integration-examples.odata-examples.get-masters.caption'),
              title: i18n.t('forms.application.sitemap.integration-examples.odata-examples.get-masters.title'),
              children: [{
                link: 'integration-examples/odata-examples/get-masters/ember-flexberry-dummy-sotrudnik-l',
                caption: i18n.t('forms.application.sitemap.integration-examples.odata-examples.get-masters.sotrudnik.caption'),
                title: i18n.t('forms.application.sitemap.integration-examples.odata-examples.get-masters.sotrudnik.title'),
                children: null
              }, {
                link: 'integration-examples/odata-examples/get-masters/ember-flexberry-dummy-departament-l',
                caption: i18n.t('forms.application.sitemap.integration-examples.odata-examples.get-masters.departament.caption'),
                title: i18n.t('forms.application.sitemap.integration-examples.odata-examples.get-masters.departament.title'),
                children: null
              }, {
                link: 'integration-examples/odata-examples/get-masters/ember-flexberry-dummy-vid-departamenta-l',
                caption: i18n.t('forms.application.sitemap.integration-examples.odata-examples.get-masters.vid-departamenta.caption'),
                title: i18n.t('forms.application.sitemap.integration-examples.odata-examples.get-masters.vid-departamenta.title'),
                children: null
              }]
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
    },

    /**
      Array of search objects.

      @property sitemap
      @type Array
    */
      this.set('sitemap', []);
  });


  test('it renders properly', async function(assert) {
    this.set('sitemap', this._sitemap().nodes);
    assert.expect(8);

    await render(hbs`{{flexberry-sitemap-searchbar
      sitemap=sitemap}}`);

    assert.equal(this.element.textContent.trim(), '');

    // Retrieve component.
    const $component = this.element.querySelector('.sitemap-searchbar.ui.search');
    $component.firstElementChild.click();
    const results = $component.querySelector('.sitemap-search-results-list');

    assert.notEqual(results.children.length, 0);

    let value = this.get('i18n').t('forms.application.sitemap.lock.caption');
    const $input = $component.querySelector('.ember-text-field');
    await fillIn($input, value); 
    await settled();
    assert.equal($input.value, value);
    assert.equal(results.children.length, 1);
    assert.equal(results.querySelector('.flexberry-toggler-caption').innerHTML, value);

    value = 'sfnesjgbsnsrf';
    await fillIn($input, value); 
    await settled();
    assert.equal($input.value, value);
    assert.equal(results.children.length, 1);
    const notFoundMsg = this.get('i18n').t('components.flexberry-sitemap-searchbar.notFoundMsg');
    assert.equal(results.querySelector('.header').innerText, notFoundMsg);
  });
});


