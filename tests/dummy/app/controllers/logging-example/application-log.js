import Ember from 'ember';
import ListFormController from 'ember-flexberry/controllers/i-i-s-caseberry-logging-objects-application-log-l';
const { getOwner } = Ember;

export default ListFormController.extend({
  /**
  Flexberry Logging Service

   @property flexberryLoggingService
   @type String[]
   */
  flexberryLoggingService: Ember.inject.service('flexberry-logging'),

  _messageNumber: 0,

  logLevel: 0,

  /**
    Available test application level settings

    @property settings
    @type String[]
   */
  settings: [],

  /**
   Default choise in settings

   @property text
   @type String[]
   */
  text: '',

  _router: undefined,

  init() {
    this._router = getOwner(this).lookup('router:main');
    this.logLevel = this.get('flexberryLoggingService').flexberryLogLevel;
    let enumsLoglevel = this.get('flexberryLoggingService').enumsLoglevel;
    this.settings[0] = '0: OFF';
    for (let level = 1; level < enumsLoglevel.length; level++) {
      this.settings[level] = level + ': ' + enumsLoglevel.slice(1, level + 1).join('s, ') + 's';
    }

    this.text = this.settings[this.logLevel];
  },

  /**
Supported actions

 */
  actions: {
    /**
     List buttons describers for Supported actions
     */
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
        buttonName: 'Throw',
        buttonAction: 'throwAction',
        buttonClasses: 'ui orange button'
      }, {
        buttonName: 'Warn',
        buttonAction: 'warnAction',
        buttonClasses: 'ui teal button'

      }, {
        buttonName: 'Log',
        buttonAction: 'logAction',
        buttonClasses: 'ui teal button'
      }, {
        buttonName: 'Info',
        buttonAction: 'infoAction',
        buttonClasses: 'ui teal button'
      }, {
        buttonName: 'Debug',
        buttonAction: 'debugAction',
        buttonClasses: 'ui yellow button'

      }, {
        buttonName: 'Deprecation',
        buttonAction: 'deprecationAction',
        buttonClasses: 'ui yellow button'
      }];
    },

    /**
     j hghhjl*k

     */
    setLogLevel(choosed) {
      this.logLevel = parseInt(choosed.substr(0, 1));
      this.get('flexberryLoggingService').flexberryLogLevel = this.logLevel;
    },

    /**
jhghhjlk

     */
    assertAction() {
      if (this.logLevel < 1) {
        if (!confirm('Текущий уровень отладки (' + this.logLevel + ') не обеспечивает удаленное логирование сообщений категории Assert. Продолжить?')) {
          return;
        }
      }

      let message = this._getMessageNumber() + 'Assert invocation testing';
      try {
        Ember.assert(message, false);
      } catch (e) {
        Ember.Logger.error(e);
        this._router.router.refresh();
      }
    },

    /**
jhghhjlk

     */
    errorAction() {
      if (this.logLevel < 1) {
        if (!confirm('Текущий уровень отладки (' + this.logLevel + ') не обеспечивает удаленное логирование сообщений категории Error. Продолжить?')) {
          return;
        }
      }

      try {
        eval('error_operator');
      } catch (e) {
        e.message = this._getMessageNumber() + e.message;
        Ember.Logger.error(e);
        this._router.router.refresh();
      }
    },

    /**
     j hghh*jlk

     */
    throwAction() {
      if (this.logLevel < 1) {
        if (!confirm('Текущий уровень отладки (' + this.logLevel + ') не обеспечивает удаленное логирование сообщений категории Throw. Продолжить?')) {
          return;
        }
      }

      try {
        let message = this._getMessageNumber() + 'Throw invocation testing';
        throw new Error(message);
      } catch (e) {
        Ember.Logger.error(e);
        this._router.router.refresh();
      }
    },

    /**
     * jhghhjlk
     *
     */
    deprecationAction() {
      if (this.logLevel < 6) {
        if (!confirm('Текущий уровень отладки (' + this.logLevel + ') не обеспечивает удаленное логирование сообщений категории Deprecation. Продолжить?')) {
          return;
        }
      }

      let message = 'DEPRECATION:' + this._getMessageNumber() + 'Deprecation invocation testing';
      Ember.Logger.warn(message);
      this._router.router.refresh();
    },

    /**
     * jhghhjlk
     *
     */
    debugAction() {
      if (this.logLevel < 5) {
        if (!confirm('Текущий уровень отладки (' + this.logLevel + ') не обеспечивает удаленное логирование сообщений категории Debug. Продолжить?')) {
          return;
        }
      }

      let message = this._getMessageNumber() + 'Debug invocation testing';
      Ember.Logger.debug(message);
      this._router.router.refresh();
    },

    /**
jhghhjlk

   */
    infoAction() {
      if (this.logLevel < 4) {
        if (!confirm('Текущий уровень отладки (' + this.logLevel + ') не обеспечивает удаленное логирование сообщений категории Info. Продолжить?')) {
          return;
        }
      }

      let message = this._getMessageNumber() + 'Info invocation testing';
      Ember.Logger.info(message);
      this._router.router.refresh();
    },
    /**
jhghhjlk

     */
    logAction() {
      if (this.logLevel < 3) {
        if (!confirm('Текущий уровень отладки (' + this.logLevel + ') не обеспечивает удаленное логирование сообщений категории Log. Продолжить?')) {
          return;
        }
      }

      let message = this._getMessageNumber() + 'Log invocation testing';
      Ember.Logger.log(message);
      this._router.router.refresh();
    },

    /**
     * jhghhjlk
     *
     */
    warnAction() {
      if (this.logLevel < 2) {
        if (!confirm('Текущий уровень отладки (' + this.logLevel + ') не обеспечивает удаленное логирование сообщений категории Warn. Продолжить?')) {
          return;
        }
      }

      let message = this._getMessageNumber() + 'Warning invocation testing';
      Ember.Logger.warn(message);
      this._router.router.refresh();
    }

  },
  _getMessageNumber() {
    this._messageNumber += 1;
    let ret =  this.get('moment').moment.format('hh:mm:ss a') + ' №' + this._messageNumber + ': ';
    return ret;
  }
});
