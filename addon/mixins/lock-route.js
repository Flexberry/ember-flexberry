/**
  @module ember-flexberry
*/

import Ember from 'ember';
import { Query } from 'ember-flexberry-data';

/**
  Mixin for {{#crossLink "EditFormRoute"}}{{/crossLink}}, which provides support locking.

  @class LockRouteMixin
  @uses <a href="http://emberjs.com/api/classes/Ember.Mixin.html">Ember.Mixin</a>
*/
export default Ember.Mixin.create({
  /**
    @property _currentLock
    @type DS.Model
    @default null
    @private
  */
  _currentLock: null,

  /**
    @property _readonly
    @type Boolean
    @default false
    @private
  */
  _readonly: false,

  /**
    This property uses for setting user name.

    @example
      ```javascript
      // app/routes/user-edit.js
      import EditFormRoute from 'ember-flexberry/routes/edit-form';
      export default EditFormRoute.extend({
        ...
        userName: Ember.computed(function() {
          let userService = Ember.getOwner(this).lookup('service:user');
          return userService.getCurrentUserName();
        }),
        ...
      });
      ```

    @property userName
    @type String
    @default 'admin'
    @for EditFormRoute
  */
  userName: 'admin',

  /**
    This object contains answers which will corresponding functions resolved.

    @property defaultBehaviorLock
    @type Object
    @default { openReadOnly: true, unlockObject: true }
    @for EditFormRoute
  */
  defaultBehaviorLock: {
    openReadOnly: true,
    unlockObject: true,
  },

  actions: {
    /**
      The willTransition action is fired at the beginning of any attempted transition with a Transition object as the sole argument.
      [More info](http://emberjs.com/api/classes/Ember.Route.html#event_willTransition).

      @method actions.willTransition
      @param {Transition} transition
    */
    willTransition(transition) {
      this.set('_readonly', false);
      let lock = this.get('_currentLock');
      if (lock) {
        this.unlockObject().then((answer) => {
          (answer ? lock.destroyRecord() : new Ember.RSVP.resolve()).then(() => {
            this.set('_currentLock', null);
          });
        });
      } else {
        this.controller.set('readonly', false);
      }
    },
  },

  /**
    This hook is the first of the route entry validation hooks called when an attempt is made to transition into a route or one of its children.
    [More info](http://emberjs.com/api/classes/Ember.Route.html#method_beforeModel).

    @method beforeModel
    @param {Transition} transition
    @return {Promise}
  */
  beforeModel(transition) {
    let params = this.paramsFor(this.routeName);
    return new Ember.RSVP.Promise((resolve, reject) => {
      if (params.id) {
        let builder = new Query.Builder(this.store)
          .from('new-platform-flexberry-services-lock')
          .selectByProjection('LockL')
          .byId(`'${params.id}'`);
        this.store.queryRecord('new-platform-flexberry-services-lock', builder.build()).then((lock) => {
          if (!lock) {
            this.store.createRecord('new-platform-flexberry-services-lock', {
              lockKey: params.id,
              userName: this.get('userName'),
              lockDate: new Date(),
            }).save().then((lock) => {
              this.set('_currentLock', lock);
              resolve();
            }).catch((reason) => {
              this.openReadOnly().then((answer) => {
                this._openReadOnly(answer, resolve, reject);
              });
            });
          } else if (lock.get('userName') === this.get('userName')) {
            this.set('_currentLock', lock);
            resolve();
          } else {
            this.openReadOnly(lock.get('userName')).then((answer) => {
              this._openReadOnly(answer, resolve, reject);
            });
          }
        });
      } else {
        resolve();
      }
    });
  },

  /**
    A hook you can use to setup the controller for the current route.
    [More info](http://emberjs.com/api/classes/Ember.Route.html#method_setupController).

    @method setupController
    @param {Controller} controller
    @param {Object} model
  */
  setupController(controller, model) {
    this._super(...arguments);
    if (this.get('_readonly')) {
      controller.set('readonly', true);
    }
  },

  /**
    This function will be called to solve open form read only or transition to parent route.
    You can override function for custom behavior.

    @example
      ```javascript
      // app/routes/user-edit.js

      import EditFormRoute from 'ember-flexberry/routes/edit-form';

      export default EditFormRoute.extend({
        ...
        openReadOnly(lockUserName) {
          return new Ember.RSVP.Promise((resolve) => {
            let answer = confirm(`This object lock user with name: '${lockUserName}'. Open read only?`);
            resolve(answer);
          });
        },
        ...
      });
      ```

    @method openReadOnly
    @param {String} lockUserName
    @return {Promise}
    @for EditFormRoute
  */
  openReadOnly(lockUserName) {
    return new Ember.RSVP.Promise((resolve) => {
      resolve(this.get('defaultBehaviorLock.openReadOnly'));
    });
  },

  /**
    This function will be called to solve unlock the object before form close.
    You can override function for custom behavior.

    @example
      ```javascript
      // app/routes/user-edit.js

      import EditFormRoute from 'ember-flexberry/routes/edit-form';

      export default EditFormRoute.extend({
        ...
        unlockObject() {
          return new Ember.RSVP.Promise((resolve) => {
            let answer = confirm(`Unlock this object?`);
            resolve(answer);
          });
        },
        ...
      });
      ```

    @method unlockObject
    @return {Promise}
    @for EditFormRoute
  */
  unlockObject() {
    return new Ember.RSVP.Promise((resolve) => {
      resolve(this.get('defaultBehaviorLock.unlockObject'));
    });
  },

  /**
    Depending on answer, open form read only or transition to parent route.

    @method _openReadOnly
    @param {Boolean} answer
    @param {function} resolve
    @param {function} reject
    @private
  */
  _openReadOnly(answer, resolve, reject) {
    if (answer) {
      this.set('_readonly', true);
      resolve();
    } else {
      this.controllerFor(this.routeName).transitionToParentRoute();
      reject();
    }
  },
});
