import Ember from 'ember';
import ListFormController from 'ember-flexberry/controllers/i-i-s-caseberry-logging-objects-application-log-l';

export default ListFormController.extend({
  flexberryLoggingervice: Ember.inject.service('flexberry-logging'),

  /**
    Available test application locales.

    @property settings
    @type String[]
   */
  settings: [
  '0 - OFF',
  '1 - ERRORs',
  '2 - WARNs, ERRORSs',
  '3 - LOGs, WARNs, ERRORs',
  '4 - INFOs, LOGs, WARNs, ERRORs',
  '5 - DEBUGs, INFOs, LOGs, WARNs, ERRORs',
  '6 - DEPRECATIONs, DEBUGs, INFOs, LOGs, WARNs, ERRORs'
  ],

  /**
jhghhjlk

 */
  actions: {
    getCustomButtons() {
      return [{
        buttonName: 'Assert',
        buttonAction: 'assertAction',
        buttonClasses: 'ui orange button'
      }, {
        buttonName: 'Error',
        buttonAction: 'errorAction',
        buttonClasses: 'ui orange button'
      }, {
        buttonName: 'Debug',
        buttonAction: 'debugAction',
        buttonClasses: 'ui orange button'
      }, {
        buttonName: 'Info',
        buttonAction: 'infoAction',
        buttonClasses: 'ui teal button'
      }, {
        buttonName: 'Log',
        buttonAction: 'logAction',
        buttonClasses: 'ui teal button'
      }, {
        buttonName: 'Warn',
        buttonAction: 'warnAction',
        buttonClasses: 'ui yellow button'
      }, {
        buttonName: 'Deprecation',
        buttonAction: 'deprecationAction',
        buttonClasses: 'ui yellow button'
      }, {
        buttonName: 'Throw',
        buttonAction: 'throwAction',
        buttonClasses: 'ui orange button'
      }];
    },

    /**
     j hghhjl*k

     */
    setLogLevel(choosed) {
      let logLevel = parseInt(choosed.substr(0, 1));
      this.get('flexberryLoggingervice').flexberryLogLevel = logLevel;
    },

    /**
jhghhjlk

     */
    assertAction() {
      Ember.assert('Assert invocation', false);
      alert('assertAction!');
    },

    /**
jhghhjlk

     */
    debugAction() {
      alert('debugAction!');
    },

    /**
jhghhjlk

     */
    errorAction() {
      alert('errorAction!');
    },

    /**
jhghhjlk

   */
    infoAction() {
      alert('infoAction!');
    },
    /**
jhghhjlk

     */
    logAction() {
      alert('logAction!');
    },

    /**
     * jhghhjlk
     *
     */
    warnAction() {
      alert('warnAction!');
    },

    /**
     * jhghhjlk
     *
     */
    deprecationAction() {
      alert('deprecationAction!');
    },

    /**
jhghhjlk

     */
    throwAction() {
      alert('throwAction!');
    }
  }
});
