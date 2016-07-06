import Ember from 'ember';
import ApplicationLogListFormController from 'ember-flexberry/controllers/i-i-s-caseberry-logging-objects-application-log-l';

export default ApplicationLogListFormController.extend({
  /**
    Object list view custom buttons, which will be used to imitate different log service events.

    @property objectListViewCustomButtons
    @type Object[]
  */
  objectListViewCustomButtons:  Ember.computed('i18n.locale', function() {
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

  actions: {
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
  getCellComponent: function(attr, bindingPath, modelClass) {
    let cellComponent = this._super(...arguments);
    cellComponent.componentProperties = {
      dateFormat: 'DD.MM.YYYY, hh:mm:ss'
    };

    return cellComponent;
  },

  /**
    Generates unique message prefix to avoid possible lost of same messages.
    If several message have same content logging service send only first to avoid possible loop on error sending stage.

    @method _generateUniqueMessagePrefix
    @return {String} Unique message prefix.
    @private
  */
  _generateUniqueMessagePrefix() {
    return '№' + Ember.generateGuid(null, '') + ': ';
  }
});
