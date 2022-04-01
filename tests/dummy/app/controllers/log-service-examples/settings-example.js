import Ember from 'ember'; //TODO Import Module. Replace Ember.Logger
import { generateGuid } from '@ember/-internals/utils';
import { computed } from '@ember/object';
import RSVP from 'rsvp';
import { deprecate } from '@ember/application/deprecations';
import { assert, warn, debug } from '@ember/debug';
import ApplicationLogListFormController from 'ember-flexberry/controllers/i-i-s-caseberry-logging-objects-application-log-l';

export default ApplicationLogListFormController.extend({
  /**
    Object list view custom buttons, which will be used to imitate different log service events.

    @property objectListViewCustomButtons
    @type Object[]
  */
  objectListViewCustomButtons: computed('i18n.locale', function() {
    return [{
      buttonName: this.get('i18n').t('forms.log-service-examples.settings-example.throw-exception-button-caption'),
      buttonAction: 'onThrowExceptionButtonClick',
      buttonClasses: 'small red'
    }, {
      buttonName: this.get('i18n').t('forms.log-service-examples.settings-example.reject-rsvp-promise-button-caption'),
      buttonAction: 'onRejectRsvpPromiseButtonClick',
      buttonClasses: 'small red'
    }, {
      buttonName: this.get('i18n').t('forms.log-service-examples.settings-example.ember-assert-button-caption'),
      buttonAction: 'onEmberAssertButtonClick',
      buttonClasses: 'small red'
    }, {
      buttonName: this.get('i18n').t('forms.log-service-examples.settings-example.ember-logger-error-button-caption'),
      buttonAction: 'onEmberLoggerErrorButtonClick',
      buttonClasses: 'small red'
    }, {
      buttonName: this.get('i18n').t('forms.log-service-examples.settings-example.ember-logger-warn-button-caption'),
      buttonAction: 'onEmberLoggerWarnButtonClick',
      buttonClasses: 'small orange'
    }, {
      buttonName: this.get('i18n').t('forms.log-service-examples.settings-example.ember-deprecate-button-caption'),
      buttonAction: 'onEmberDeprecateButtonClick',
      buttonClasses: 'small yellow'
    }, {
      buttonName: this.get('i18n').t('forms.log-service-examples.settings-example.ember-logger-log-button-caption'),
      buttonAction: 'onEmberLoggerLogButtonClick',
      buttonClasses: 'small green'
    }, {
      buttonName: this.get('i18n').t('forms.log-service-examples.settings-example.ember-logger-info-button-caption'),
      buttonAction: 'onEmberLoggerInfoButtonClick',
      buttonClasses: 'small teal'
    }, {
      buttonName: this.get('i18n').t('forms.log-service-examples.settings-example.ember-logger-debug-button-caption'),
      buttonAction: 'onEmberLoggerDebugButtonClick',
      buttonClasses: 'small blue'
    }];
  }),

  messagesToRefreshList: null,

  init() {
    this._super(...arguments);
    this.get('logService').on('error', this, this._refreshList);
    this.get('logService').on('warn', this, this._refreshList);
    this.get('logService').on('info', this, this._refreshList);
    this.get('logService').on('log', this, this._refreshList);
    this.get('logService').on('debug', this, this._refreshList);
    this.get('logService').on('deprecation', this, this._refreshList);
    this.get('logService').on('promise', this, this._refreshList);

    let i18nService = this.get('i18n');
    let messagesToRefreshList = [
      i18nService.t('forms.log-service-examples.settings-example.throw-exception-button-message'),
      i18nService.t('forms.log-service-examples.settings-example.reject-rsvp-promise-button-message'),
      i18nService.t('forms.log-service-examples.settings-example.ember-assert-button-message'),
      i18nService.t('forms.log-service-examples.settings-example.ember-logger-error-button-message'),
      i18nService.t('forms.log-service-examples.settings-example.ember-logger-warn-button-message'),
      i18nService.t('forms.log-service-examples.settings-example.ember-deprecate-button-message'),
      i18nService.t('forms.log-service-examples.settings-example.ember-logger-log-button-message'),
      i18nService.t('forms.log-service-examples.settings-example.ember-logger-info-button-message'),
      i18nService.t('forms.log-service-examples.settings-example.ember-logger-debug-button-message'),
    ];

    this.set('messagesToRefreshList', messagesToRefreshList);
  },

  willDestroy() {
    this.get('logService').off('error', this, this._refreshList);
    this.get('logService').off('warn', this, this._refreshList);
    this.get('logService').off('info', this, this._refreshList);
    this.get('logService').off('log', this, this._refreshList);
    this.get('logService').off('debug', this, this._refreshList);
    this.get('logService').off('deprecation', this, this._refreshList);
    this.get('logService').off('promise', this, this._refreshList);
  },

  actions: {
    /**
      Handles throw exception button click.
      Emulates exception thrown somewhere in application.

      @method actions.onThrowExceptionButtonClick
      @public
    */
    onThrowExceptionButtonClick() {
      throw new Error(
        this._generateUniqueMessagePrefix() +
        this.get('i18n').t('forms.log-service-examples.settings-example.throw-exception-button-message'));
    },

    /**
      Handles throw exception button click.
      Emulates exception thrown somewhere in application.

      @method actions.onRejectRsvpPromiseButtonClick
      @public
    */
    onRejectRsvpPromiseButtonClick() {
      RSVP.reject(
        this._generateUniqueMessagePrefix() +
        this.get('i18n').t('forms.log-service-examples.settings-example.reject-rsvp-promise-button-message'));
    },

    /**
      Handles ember assert button click.
      Emulates failed assert call happened somewhere in application.

      @method actions.onEmberAssertButtonClick
      @public
    */
    onEmberAssertButtonClick() {
      assert(
        this._generateUniqueMessagePrefix() +
        this.get('i18n').t('forms.log-service-examples.settings-example.ember-assert-button-message'),
        false);
    },

    /**
      Handles ember logger error button click.
      Emulates Ember.Logger.error call happened somewhere in application.

      @method actions.onEmberLoggerErrorButtonClick
      @public
    */
    onEmberLoggerErrorButtonClick() {
      Ember.Logger.error(
        this._generateUniqueMessagePrefix() +
        this.get('i18n').t('forms.log-service-examples.settings-example.ember-logger-error-button-message'));
    },

    /**
      Handles ember logger warn button click.
      Emulates Ember.warn call happened somewhere in application.

      @method actions.onEmberLoggerWarnButtonClick
      @public
    */
    onEmberLoggerWarnButtonClick() {
      warn(
        this._generateUniqueMessagePrefix() +
        this.get('i18n').t('forms.log-service-examples.settings-example.ember-logger-warn-button-message'),
        false,
        { id: 'ember-flexberry-debug.feature-logger-warn-test' });
    },

    /**
      Handles ember deprecate button click.
      Emulates Ember.deprecate call happened somewhere in application.

      @method actions.onEmberDeprecateButtonClick
      @public
    */
    onEmberDeprecateButtonClick() {
      deprecate(
        this._generateUniqueMessagePrefix() +
        this.get('i18n').t('forms.log-service-examples.settings-example.ember-deprecate-button-message'),
        false,
        { id: 'ember-flexberry-debug.feature-logger-deprecate-test', until: '0' });
    },

    /**
      Handles ember logger log button click.
      Emulates Ember.Logger.log call happened somewhere in application.

      @method actions.onEmberLoggerLogButtonClick
      @public
    */
    onEmberLoggerLogButtonClick() {
      Ember.Logger.log(
        this._generateUniqueMessagePrefix() +
        this.get('i18n').t('forms.log-service-examples.settings-example.ember-logger-log-button-message'));
    },

    /**
      Handles ember logger info button click.
      Emulates Ember.Logger.info call happened somewhere in application.

      @method actions.onEmberLoggerInfoButtonClick
      @public
    */
    onEmberLoggerInfoButtonClick() {
      Ember.Logger.info(
        this._generateUniqueMessagePrefix() +
        this.get('i18n').t('forms.log-service-examples.settings-example.ember-logger-info-button-message'));
    },

    /**
      Handles ember logger debug button click.
      Emulates Ember.debug call happened somewhere in application.

      @method actions.onEmberLoggerDebugButtonClick
      @public
    */
    onEmberLoggerDebugButtonClick() {
      debug(
        this._generateUniqueMessagePrefix() +
        this.get('i18n').t('forms.log-service-examples.settings-example.ember-logger-debug-button-message'));
    }
  },

  /**
    Method to get type and attributes of a component,
    which will be embeded in object-list-view cell.

    @method getCellComponent.
    @param {Object} attr Attribute of projection property related to current table cell.
    @param {String} bindingPath Path to model property related to current table cell.
    @param {Object} modelClass Model class of data record related to current table row.
    @return {Object} Object containing name & properties of component, which will be used to render current table cell.
    { componentName: 'my-component',  componentProperties: { ... } }.
  */
  /* eslint-disable no-unused-vars */
  getCellComponent: function(attr, bindingPath, modelClass) {
    if (bindingPath === 'timestamp') {
      return {
        componentName: 'object-list-view-cell',
        componentProperties: {
          dateFormat: 'DD.MM.YYYY, hh:mm:ss'
        }
      };
    }

    return this._super(...arguments);
  },
  /* eslint-enable no-unused-vars */

  /**
    Generates unique message prefix to avoid possible lost of same messages.
    If several message have same content logging service send only first to avoid possible loop on error sending stage.

    @method _generateUniqueMessagePrefix
    @return {String} Unique message prefix.
    @private
  */
  _generateUniqueMessagePrefix() {
    return '№' + generateGuid(null, '') + ': ';
  },

  /**
    Refreshes list of log messages on form.

    @method _refreshList
    @private
  */
  _refreshList(applicationLogModel) {
    let messagesToRefreshList = this.get('messagesToRefreshList');
    if (applicationLogModel) {
      let message = applicationLogModel.get('message');
      let needToRefresh = false;
      for (let i = 0; i < messagesToRefreshList.length; i++) {
        if (message.indexOf(messagesToRefreshList[i]) > -1) {
          needToRefresh = true;
          break;
        }
      }

      if (needToRefresh) {
        this.send('refreshList');
      }
    }
  }
});
