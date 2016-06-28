import Ember from 'ember';
import ListFormController from 'ember-flexberry/controllers/i-i-s-caseberry-logging-objects-application-log-l';
const { getOwner } = Ember;

export default ListFormController.extend({
  /**
  Static incremented value to create uniqie message number

   @property flexberryLoggingService
   @type String[]
   */
  _messageNumber: 0,

  /**
  Flexberry Logging Service

   @property flexberryLoggingService
   @type String[]
   */
  flexberryLoggingService: Ember.inject.service('flexberry-logging'),

  /**
  Current logging level

  @property logLevel
  @type Integer
   */
  logLevel: 0,

  /**
    List of available test application level settings: [ '0 OFF', 1: 'ERRORs', 2: 'ERRORs, WARNs', ... ].
    First symbol - number of logging level, followed by list list of logging levels.

    @property settings
    @type String[]
   */
  settings: [],

  /**
   Default choise in settings

   @property text
   @type String
   */
  text: '',

  /**
   List buttons describers for Supported actions

   @property customButtons
   @type Object[]
   */
  customButtons:  Ember.computed('i18n.locale', function() {
    let ret = [{
      buttonName: this.get('i18n').t('forms.application-log.assert'),
      buttonAction: 'assertAction',
      buttonClasses: 'ui orange button'
    }, {
      buttonName: this.get('i18n').t('forms.application-log.error'),
      buttonAction: 'errorAction',
      buttonClasses: 'ui orange button'
    }, {
      buttonName: this.get('i18n').t('forms.application-log.throw'),
      buttonAction: 'throwAction',
      buttonClasses: 'ui orange button'
    }, {
      buttonName: this.get('i18n').t('forms.application-log.warn'),
      buttonAction: 'warnAction',
      buttonClasses: 'ui teal button'

    }, {
      buttonName: this.get('i18n').t('forms.application-log.log'),
      buttonAction: 'logAction',
      buttonClasses: 'ui teal button'
    }, {
      buttonName: this.get('i18n').t('forms.application-log.info'),
      buttonAction: 'infoAction',
      buttonClasses: 'ui teal button'
    }, {
      buttonName: this.get('i18n').t('forms.application-log.debug'),
      buttonAction: 'debugAction',
      buttonClasses: 'ui yellow button'

    }, {
      buttonName: this.get('i18n').t('forms.application-log.deprecation'),
      buttonAction: 'deprecationAction',
      buttonClasses: 'ui yellow button'
    }];
    return ret;
  }),

  _router: undefined,

  /**
  Selected jQuery object, containing HTML of confirm modal dialog.

  @property confirmModalDialog
  @type Object
  @default undefined
  */
  confirmModalDialog: undefined,

  /**
  Content to be displayed in confirm modal dialog.
  It will be displayed only if some confirm needs.

  @property confirmModalDialogContent
  @type String
  @default ''
   */
  confirmModalDialogContent: '',

  /**
  Category to be passed in action confirm modal dialog: 'Error', 'Warn', 'Log', 'Info', ...

  @property confirmModalDialogCategory
  @type String
  @default ''
   */
  confirmModalDialogCategory: '',

  /**
    Initialize properties

    @method init
   */
  init() {
    this.set('_router', getOwner(this).lookup('router:main'));
    this.set('logLevel', this.get('flexberryLoggingService').flexberryLogLevel);
    let enumsLoglevel = this.get('flexberryLoggingService').enumsLoglevel;
    let settings  = ['0: OFF'];
    for (let level = 1; level < enumsLoglevel.length; level++) {
      settings[level] = level + ': ' + enumsLoglevel.slice(1, level + 1).join('s, ') + 's';
    }

    this.set('settings', settings);
    this.set('text', this.settings[this.logLevel]);
  },

  actions: {
    /**
      Handler to set current logging level.

      @method actions.setLogLevel
      @param {String} choosed case string
     */

    setLogLevel(choosed) {
      this.set('logLevel', parseInt(choosed.substr(0, 1)));
      this.get('flexberryLoggingService').flexberryLogLevel = this.logLevel;
    },

    /**
     Handler to emulate failure of the operator assert.

      @method actions.assertAction
     */
    assertAction() {
      if (this.logLevel < 1) {
        this.showConfirmModalDialog('Assert');
        return;
      }

      this.makeAssert();
    },

    /**
     Handler to emulate syntax error generation.

      @method actions.errorAction
     */
    errorAction() {
      if (this.logLevel < 1) {
        this.showConfirmModalDialog('Error');
        return;
      }

      this.makeError();
    },

    /**
     Handler to emulate exception generation by throw operator.

     @method actions.throwAction
     */
    throwAction() {
      if (this.logLevel < 1) {
        this.showConfirmModalDialog('Throw');
        return;
      }

      this.makeThrow();
    },

    /**
     Handler to emulate deprecation level message.

     @method actions.deprecationAction
    */
    deprecationAction() {
      if (this.logLevel < 6) {
        this.showConfirmModalDialog('Deprecation');
        return;
      }

      this.makeDeprecation();
    },

    /**
     Handler to emulate debug level message.

     @method actions.debugAction
     */
    debugAction() {
      if (this.logLevel < 5) {
        this.showConfirmModalDialog('Debug');
        return;
      }

      this.makeDebug();
    },

    /**
     Handler to emulate info level message.

     @method actions.infoAction
  */
    infoAction() {
      if (this.logLevel < 4) {
        this.showConfirmModalDialog('Info');
        return;
      }

      this.makeInfo();
    },
    /**
     Handler to emulate log level message.

     @method actions.logAction
     */
    logAction() {
      if (this.logLevel < 3) {
        this.showConfirmModalDialog('Log');
        return;
      }

      this.makeLog();
    },

    /**
     Handler to emulate warn level message

     @method actions.warnAction
     */
    warnAction() {
      if (this.logLevel < 2) {
        this.showConfirmModalDialog('Warn');
        return;
      }

      this.makeWarn();
    },

    /**
      Handler called on confirmation of insuffience current Logging level.

      @method actions.confirmed
      @param {String} name of the message level: Assert, Error, Throw, ...
     */
    confirmed(category) {
      switch (category) {
        case 'Assert':
          this.makeAssert();
          break;
        case 'Error':
          this.makeError();
          break;
        case 'Throw':
          this.makeThrow();
          break;
        case 'Warn':
          this.makeWarn();
          break;
        case 'Deprecation':
          this.makeDeprecation();
          break;
        case 'Debug':
          this.makeDebug();
          break;
        case 'Info':
          this.makeInfo();
          break;
        case 'Log':
          this.makeLog();
          break;
        case 'Warn':
          this.makeWarn();
          break;
      }
    },

    /**
      Handler to close confirm modal dialog on cancel confirmation.

      @method actions.closeDialog
     */
    closeDialog() {
      if (this.confirmModalDialog === undefined) {
        return;
      }

      this.set('confirmModalDialogContent', undefined);
      this.set('confirmModalDialogCategory', undefined);
      this.confirmModalDialog.modal('hide');
    }

  },

  /**
     Method to emulate failure of the operator assert.
     It is called from assertAction or confirmed

     @method makeAssert
    */
  makeAssert() {
    let i18n = this.get('i18n');
    let message = this._getMessageNumber() + i18n.t('forms.application-log.assertMessage');
    try {
      Ember.assert(message, false);
    } catch (e) {
      Ember.Logger.error(e);
      this._router.router.refresh();
    }

  },

  /**
    Method to emulate syntax error generation.

    @method makeError
    */
  makeError() {
    let i18n = this.get('i18n');
    try {
      eval('error_operator');
    } catch (e) {
      e.message = this._getMessageNumber() + i18n.t('forms.application-log.errortMessage') + e.message;
      Ember.Logger.error(e);
      this._router.router.refresh();
    }

  },

  /**
    Method to emulate exception generation by throw operator.

    @method makeThrow
    */
  makeThrow() {
    let i18n = this.get('i18n');
    try {
      let message = this._getMessageNumber() + i18n.t('forms.application-log.throwMessage');
      throw new Error(message);
    } catch (e) {
      Ember.Logger.error(e);
      this._router.router.refresh();
    }

  },

  /**
    Method to emulate deprecation level message.

    @method makeDeprecation
   */
  makeDeprecation() {
    let i18n = this.get('i18n');
    let message = 'DEPRECATION:' + this._getMessageNumber() +  i18n.t('forms.application-log.deprecationMessage');
    Ember.Logger.warn(message);
    this._router.router.refresh();
  },

  /**
  Method

  @method makeDebug
  */
  makeDebug() {
    let i18n = this.get('i18n');
    let message = this._getMessageNumber() +  i18n.t('forms.application-log.debugMessage');
    Ember.Logger.debug(message);
    this._router.router.refresh();
  },

  /**
    Method

    @method makeInfo
   */
  makeInfo() {
    let i18n = this.get('i18n');
    let message = this._getMessageNumber() +  i18n.t('forms.application-log.infoMessage');
    Ember.Logger.info(message);
    this._router.router.refresh();
  },

  /**
    Method

    @method makeLog
   */
  makeLog() {
    let i18n = this.get('i18n');
    let message = this._getMessageNumber() +  i18n.t('forms.application-log.logMessage');
    Ember.Logger.log(message);
    this._router.router.refresh();
  },

  /**
    Method

    @method makeWarn
   */
  makeWarn() {
    let i18n = this.get('i18n');
    let message = this._getMessageNumber() +  i18n.t('forms.application-log.warnMessage');
    Ember.Logger.warn(message);
    this._router.router.refresh();
  },

  /**
    Shows confirm modal dialog.

    @method showConfirmModalDialog
    @param {String} Confirm category
    @returns {String} Confirm content.
   */
  showConfirmModalDialog(category) {
    if (this.confirmModalDialog === undefined) {
      this.confirmModalDialog = Ember.$('.application-log-modal-dialog');
      this.confirmModalDialog.modal('setting', 'closable', false);
    }

    let i18n = this.get('i18n');
    let confirmContent = i18n.t('forms.application-log.confirmMessage1') +
      this.logLevel +
      i18n.t('forms.application-log.confirmMessage2') +
      '`' + category + '`' +
      i18n.t('forms.application-log.confirmMessage3');
    this.set('confirmModalDialogContent', confirmContent);
    this.set('confirmModalDialogCategory', category);
    this.confirmModalDialog.modal('show');
    return confirmContent;
  },

  /**
  Form uniq message number to avoid lost same messages.
  If several message have same content logging service send only first to avoid unterminated circle on error on sending stage.
  Message number consist of current number and current time.

  @method _getMessageNumber
  @returns {String} Uniq header.
  */
  _getMessageNumber() {
    this.set('_messageNumber', this.get('_messageNumber') + 1);
    let ret =  '№' + this._messageNumber + '@' +  this.get('moment').moment().format('hh:mm:ss a')  + ': ';
    return ret;
  }
});
