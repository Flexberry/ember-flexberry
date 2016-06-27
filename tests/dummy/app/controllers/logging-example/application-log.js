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

  /**
   List buttons describers for Supported actions
   */
  customButtons:  [{
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
    }],

  _router: undefined,

  /**
   *    Selected jQuery object, containing HTML of confirm modal dialog.
   *
   *    @property confirmModalDialog
   *    @type Object
   *    @default null
   */
  confirmModalDialog: undefined,

  /**
   *    Content to be displayed in confirm modal dialog.
   *    It will be displayed only if some confirm needs.
   *
   *    @property confirmModalDialogContent
   *    @type String
   *    @default 't('components.flexberry-file.confirm-dialog-content')'
   */
  confirmModalDialogContent: '',

<<<<<<< HEAD
  /**
=======
/**
>>>>>>> 2826c5db4fedf5bc40671c07987bd72ff54e8b88
   *    Category to be passed in action confirm modal dialog.
   *
   *    @property confirmModalDialogCategory
   *    @type String
   *    @default ''
   */
  confirmModalDialogCategory: '',

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
        this.showConfirmModalDialog('Assert');
        return;
      }

      this.makeAssert();
    },

    /**
jhghhjlk

     */
    errorAction() {
      if (this.logLevel < 1) {
        this.showConfirmModalDialog('Error');
        return;
      }

      this.makeError();
    },

    /**
     j hghh*jlk

     */
    throwAction() {
      if (this.logLevel < 1) {
        this.showConfirmModalDialog('Throw');
        return;
      }

      this.makeThrow();
    },

    /**
     * jhghhjlk
     *
     */
    deprecationAction() {
      if (this.logLevel < 6) {
        this.showConfirmModalDialog('Deprecation');
        return;
      }

      this.makeDeprecation();
    },

    /**
     * jhghhjlk
     *
     */
    debugAction() {
      if (this.logLevel < 5) {
        this.showConfirmModalDialog('Debug');
        return;
      }

      this.makeDebug();
    },

    /**
jhghhjlk

  */
    infoAction() {
      if (this.logLevel < 4) {
        this.showConfirmModalDialog('Info');
        return;
      }

      this.makeInfo();
    },
    /**
jhghhjlk

     */
    logAction() {
      if (this.logLevel < 3) {
        this.showConfirmModalDialog('Log');
        return;
      }

      this.makeLog();
    },

    /**
     * jhghhjlk
     *
     */
    warnAction() {
      if (this.logLevel < 2) {
        this.showConfirmModalDialog('Warn');
        return;
      }

      this.makeWarn();
    },

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
     *    Close confirm modal dialog.
     *
     *    @method hideConfirmModalDialog
     *    @param {String} confirmCaption Confirm caption (window header caption).
     *    @param {String} confirmContent Confirm content (window body content).
     *    @returns {String} Confirm content.
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

  makeAssert() {
    let message = this._getMessageNumber() + 'Assert invocation testing';
    try {
      Ember.assert(message, false);
    } catch (e) {
      Ember.Logger.error(e);
      this._router.router.refresh();
    }

  },

  makeError() {
    try {
      eval('error_operator');
    } catch (e) {
      e.message = this._getMessageNumber() + e.message;
      Ember.Logger.error(e);
      this._router.router.refresh();
    }

  },

  makeThrow() {
    try {
      let message = this._getMessageNumber() + 'Throw invocation testing';
      throw new Error(message);
    } catch (e) {
      Ember.Logger.error(e);
      this._router.router.refresh();
    }

  },

  makeDeprecation() {
    let message = 'DEPRECATION:' + this._getMessageNumber() + 'Deprecation invocation testing';
    Ember.Logger.warn(message);
    this._router.router.refresh();
  },

  makeDebug() {
    let message = this._getMessageNumber() + 'Debug invocation testing';
    Ember.Logger.debug(message);
    this._router.router.refresh();
  },

  makeInfo() {
    let message = this._getMessageNumber() + 'Info invocation testing';
    Ember.Logger.info(message);
    this._router.router.refresh();
  },

  makeLog() {
    let message = this._getMessageNumber() + 'Log invocation testing';
    Ember.Logger.log(message);
    this._router.router.refresh();
  },

  makeWarn() {
    let message = this._getMessageNumber() + 'Warning invocation testing';
    Ember.Logger.warn(message);
    this._router.router.refresh();
  },

  /**
   *    Shows confirm modal dialog.
   *
   *    @method showConfirmModalDialog
   *    @param {String} Confirm category
   *    @returns {String} Confirm content.
   */
  showConfirmModalDialog(category) {
    if (this.confirmModalDialog === undefined) {
      this.confirmModalDialog = Ember.$('.application-log-modal-dialog');
      this.confirmModalDialog.modal('setting', 'closable', false);
    }

    let confirmContent = 'Текущий уровень отладки (' +
      this.logLevel +
      ') не обеспечивает удаленное логирование сообщений категории ' +
      category +
      '. Продолжить?';
    this.set('confirmModalDialogContent', confirmContent);
    this.set('confirmModalDialogCategory', category);
    this.confirmModalDialog.modal('show');
    return confirmContent;
  },

  _getMessageNumber() {
    this._messageNumber += 1;
    let ret =  this.get('moment').moment().format('hh:mm:ss a') + ' №' + this._messageNumber + ': ';
    return ret;
  }
});
