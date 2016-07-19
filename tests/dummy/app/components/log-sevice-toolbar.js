import Ember from 'ember';
import OlvToolbar from 'ember-flexberry/components/olv-toolbar';
import { translationMacro as t } from 'ember-i18n';

export default OlvToolbar.extend({
  tagName: "",

  actions: {
    /**
      Action for custom button.

      @method actions.customButtonAction
      @public
      @param {String} actionName The name of action
    */
    customButtonAction(actionName) {
      this.sendAction('customButtonAction', actionName);
    },

    /**
      Handles throw exception button click.
      Emulates exception thrown somewhere in application.

      @method actions.onThrowExceptionButtonClick
      @public
    */
    onThrowExceptionButtonClick() {
      setTimeout(() => {
        this.send('refreshList');
      }, 100);
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
      new Ember.RSVP.Promise((resolve, reject) => {
        setTimeout(() => {
          reject(
            this._generateUniqueMessagePrefix() +
            this.get('i18n').t('forms.log-service-examples.settings-example.reject-rsvp-promise-button-message'));
          this.send('refreshList');
        }, 100);
      });
    },

    /**
      Handles ember assert button click.
      Emulates failed Ember.assert call happened somewhere in application.

      @method actions.onEmberAssertButtonClick
      @public
    */
    onEmberAssertButtonClick() {
      setTimeout(() => {
        this.send('refreshList');
      }, 100);
      Ember.assert(
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
      this.send('refreshList');
    },

    /**
      Handles ember logger warn button click.
      Emulates Ember.Logger.warn call happened somewhere in application.

      @method actions.onEmberLoggerWarnButtonClick
      @public
    */
    onEmberLoggerWarnButtonClick() {
      Ember.Logger.warn(
        this._generateUniqueMessagePrefix() +
        this.get('i18n').t('forms.log-service-examples.settings-example.ember-logger-warn-button-message'));
      this.send('refreshList');
    },

    /**
      Handles ember deprecate button click.
      Emulates Ember.deprecate call happened somewhere in application.

      @method actions.onEmberDeprecateButtonClick
      @public
    */
    onEmberDeprecateButtonClick() {
      Ember.deprecate(
        this._generateUniqueMessagePrefix() +
        this.get('i18n').t('forms.log-service-examples.settings-example.ember-deprecate-button-message'),
        false,
        { id: '0', until: '0' });
      this.send('refreshList');
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
      this.send('refreshList');
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
      this.send('refreshList');
    },

    /**
      Handles ember logger debug button click.
      Emulates Ember.Logger.debug call happened somewhere in application.

      @method actions.onEmberLoggerDebugButtonClick
      @public
    */
    onEmberLoggerDebugButtonClick() {
      Ember.Logger.debug(
        this._generateUniqueMessagePrefix() +
        this.get('i18n').t('forms.log-service-examples.settings-example.ember-logger-debug-button-message'));
      this.send('refreshList');
    },
  }
});
