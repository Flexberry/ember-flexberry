import { getOwner } from '@ember/application';
import { computed } from '@ember/object';
import EditFormRoute from 'ember-flexberry/routes/edit-form';
import NewPlatformFlexberryServicesLockListController from 'ember-flexberry/controllers/new-platform-flexberry-services-lock-list';

export default NewPlatformFlexberryServicesLockListController.extend({
  /**
    Current value `defaultBehaviorLock.openReadOnly` from {{#crossLink "EditFormRoute"}}{{/crossLink}}.

    @property openReadOnly
    @type Boolean
    @default false
  */
  openReadOnly: false,

  /**
    Current value `defaultBehaviorLock.unlockObject` from {{#crossLink "EditFormRoute"}}{{/crossLink}}.

    @property unlockObject
    @type Boolean
    @default false
  */
  unlockObject: false,

  /**
    Custom buttons for `flexberry-objectlistview` on `new-platform-flexberry-services-lock-list` route.

    @property customButtons
    @type Array
  */
  customButtons: computed('i18n.locale', 'openReadOnly', 'unlockObject', function() {
    let i18n = this.get('i18n');
    let baseClasses = 'floated tiny compact';
    let openReadOnly = this.get('openReadOnly') ? 'positive' : 'negative';
    let unlockObject = this.get('unlockObject') ? 'positive' : 'negative';
    return [{
      buttonName: i18n.t('forms.new-platform-flexberry-services-lock-list.change-user-name'),
      buttonAction: 'changeUserName',
      buttonClasses: baseClasses,
    }, {
      buttonName: i18n.t('forms.new-platform-flexberry-services-lock-list.open-read-only'),
      buttonAction: 'openReadOnly',
      buttonClasses: `${baseClasses} ${openReadOnly}`,
    }, {
      buttonName: i18n.t('forms.new-platform-flexberry-services-lock-list.unlock-object'),
      buttonAction: 'unlockObject',
      buttonClasses: `${baseClasses} ${unlockObject}`,
    }];
  }),

  actions: {
    /**
      Change current value `userName` for {{#crossLink "EditFormRoute"}}{{/crossLink}}.

      @method actions.changeUserName
    */
    changeUserName() {
      let i18n = this.get('i18n');
      let userService = getOwner(this).lookup('service:user');
      let currentUserName = userService.getCurrentUserName();
      let newUserName = window.prompt(i18n.t('forms.new-platform-flexberry-services-lock-list.enter-new-user-name'), currentUserName);
      if (typeof newUserName === 'string') {
        userService.set('userName', newUserName);
      }
    },

    /**
      Change current value `defaultBehaviorLock.openReadOnly` for {{#crossLink "EditFormRoute"}}{{/crossLink}}.

      @method actions.openReadOnly
    */
    openReadOnly() {
      let currentDefaultBehaviorLock = EditFormRoute.create().get('defaultBehaviorLock');
      currentDefaultBehaviorLock.openReadOnly = !currentDefaultBehaviorLock.openReadOnly;
      EditFormRoute.reopen({ defaultBehaviorLock: currentDefaultBehaviorLock });
      this.set('openReadOnly', currentDefaultBehaviorLock.openReadOnly);
    },

    /**
      Change current value `defaultBehaviorLock.unlockObject` for {{#crossLink "EditFormRoute"}}{{/crossLink}}.

      @method actions.unlockObject
    */
    unlockObject() {
      let currentDefaultBehaviorLock = EditFormRoute.create().get('defaultBehaviorLock');
      currentDefaultBehaviorLock.unlockObject = !currentDefaultBehaviorLock.unlockObject;
      EditFormRoute.reopen({ defaultBehaviorLock: currentDefaultBehaviorLock });
      this.set('unlockObject', currentDefaultBehaviorLock.unlockObject);
    },
  },

  /**
    An overridable method called when objects are instantiated.
    [More info](https://www.emberjs.com/api/ember/release/classes/Route/methods/init?anchor=init).

    @method init
  */
  init() {
    this._super(...arguments);
    let currentDefaultBehaviorLock = EditFormRoute.create().get('defaultBehaviorLock');
    if (currentDefaultBehaviorLock) {
      this.set('openReadOnly', currentDefaultBehaviorLock.openReadOnly);
      this.set('unlockObject', currentDefaultBehaviorLock.unlockObject);
    }
  },
});
