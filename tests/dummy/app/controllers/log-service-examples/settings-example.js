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
      buttonClasses: 'small orange'
    }, {
      buttonName: this.get('i18n').t('forms.log-service-examples.settings-example.ember-logger-log-button-caption'),
      buttonAction: 'onEmberLoggerLogButtonClick',
      buttonClasses: 'small blue'
    }, {
      buttonName: this.get('i18n').t('forms.log-service-examples.settings-example.ember-logger-info-button-caption'),
      buttonAction: 'onEmberLoggerInfoButtonClick',
      buttonClasses: 'small blue'
    }, {
      buttonName: this.get('i18n').t('forms.log-service-examples.settings-example.ember-logger-debug-button-caption'),
      buttonAction: 'onEmberLoggerDebugButtonClick',
      buttonClasses: 'small blue'
    }];
  }),

  actions: {
    configurateToolbar(toolbarComponent) {
      toolbarComponent.name = 'log-service-toolbar';
      return toolbarComponent;
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
    return '№' + Ember.generateGuid(null, '-') + ': ';
  }
});
