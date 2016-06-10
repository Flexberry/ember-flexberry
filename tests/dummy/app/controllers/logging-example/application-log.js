import ListFormController from 'ember-flexberry/controllers/i-i-s-caseberry-logging-objects-application-log-l';

export default ListFormController.extend({
  /**
    Available test application locales.

    @property settings
    @type String[]
   */
  settings: ['0', '1', '2', '3', '4', '5', '6'],

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
        buttonName: 'Debag',
        buttonAction: 'debagAction',
        buttonClasses: 'ui orange button'
      }, {
        buttonName: 'Error',
        buttonAction: 'errorAction',
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
        buttonName: 'Throw',
        buttonAction: 'throwAction',
        buttonClasses: 'ui orange button'
      }];
    },

    /**
jhghhjlk

     */
    assertAction() {
      alert('Привет!');
    },

    /**
jhghhjlk

     */
    debagAction() {
      alert('Пока!');
    },

    /**
jhghhjlk

     */
    errorAction() {
      alert('Пока!');
    },

    /**
jhghhjlk

   */
    infoAction() {
      alert('Пока!');
    },
    /**
jhghhjlk

     */
    logAction() {
      alert('Пока!');
    },

    /**
jhghhjlk

     */
    warnAction() {
      alert('Пока!');
    },

    /**
jhghhjlk

     */
    throwAction() {
      alert('Пока!');
    },
  }
});
