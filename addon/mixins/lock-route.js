/**
  @module ember-flexberry
*/

import Mixin from '@ember/object/mixin';
import RSVP from 'rsvp';
import { getOwner } from '@ember/application';
import Builder from 'ember-flexberry-data/query/builder';

/**
  Mixin for {{#crossLink "EditFormRoute"}}{{/crossLink}}, which provides support locking.

  @class LockRouteMixin
  @uses <a href="https://www.emberjs.com/api/ember/release/classes/Mixin">Mixin</a>
*/
export default Mixin.create({
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
      [More info](https://www.emberjs.com/api/ember/release/classes/Route/events/willTransition?anchor=willTransition).

      @method actions.willTransition
      @param {Transition} transition
    */
    /* eslint-disable no-unused-vars */
    willTransition(transition) {
      this.set('_readonly', false);
      let lock = this.get('_currentLock');
      if (lock) {
        this.unlockObject().then((answer) => {
          (answer ? lock.destroyRecord() : new RSVP.resolve()).then(() => {
            this.set('_currentLock', null);
          });
        });
      } else {
        this.controller.set('readonly', false);
      }
    },
    /* eslint-enable no-unused-vars */
  },

  /**
    This hook is the first of the route entry validation hooks called when an attempt is made to transition into a route or one of its children.
    [More info](https://www.emberjs.com/api/ember/release/classes/Route/methods/beforeModel?anchor=beforeModel).

    @method beforeModel
    @param {Transition} transition
    @return {Promise}
  */
  /* eslint-disable no-unused-vars */
  beforeModel(transition) {
    let result = this._super(...arguments);

    if (!(result instanceof RSVP.Promise)) {
      result = RSVP.resolve();
    }

    return new RSVP.Promise((resolve, reject) => {
      let params = this.paramsFor(this.routeName);
      let userService = getOwner(this).lookup('service:user');
      result.then((parentResult) => {
        if (params.id) {
          let builder = new Builder(this.store)
            .from('new-platform-flexberry-services-lock')
            .selectByProjection('LockL')
            .byId(params.id);
          this.store.queryRecord('new-platform-flexberry-services-lock', builder.build()).then((lock) => {
            if (!lock) {
              this.store.createRecord('new-platform-flexberry-services-lock', {
                lockKey: params.id,
                userName: userService.getCurrentUserName(),
                lockDate: new Date(),
              }).save().then((lock) => {
                this.set('_currentLock', lock);
                resolve(lock);
              }).catch((reason) => {
                this.openReadOnly().then((answer) => {
                  this._openReadOnly(answer, resolve, reject, reason);
                });
              });
            } else if (lock.get('userName') === userService.getCurrentUserName()) {
              this.set('_currentLock', lock);
              resolve(lock);
            } else {
              this.openReadOnly(lock.get('userName')).then((answer) => {
                this._openReadOnly(answer, resolve, reject);
              });
            }
          }).catch((reason) => {
            reject(reason);
          });
        } else {
          resolve(parentResult);
        }
      }).catch((reason) => {
        reject(reason);
      });
    });
  },
  /* eslint-enable no-unused-vars */

  /**
    A hook you can use to setup the controller for the current route.
    [More info](https://www.emberjs.com/api/ember/release/classes/Route/methods/setupController?anchor=setupController).

    @method setupController
    @param {Controller} controller
    @param {Object} model
  */
  /* eslint-disable no-unused-vars */
  setupController(controller, model) {
    this._super(...arguments);
    if (this.get('_readonly')) {
      controller.set('readonly', true);
    }
  },
  /* eslint-enable no-unused-vars */

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
          return new RSVP.Promise((resolve) => {
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
  /* eslint-disable no-unused-vars */
  openReadOnly(lockUserName) {
    return new RSVP.Promise((resolve) => {
      resolve(this.get('defaultBehaviorLock.openReadOnly'));
    });
  },
  /* eslint-enable no-unused-vars */

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
          return new RSVP.Promise((resolve) => {
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
    return new RSVP.Promise((resolve) => {
      resolve(this.get('defaultBehaviorLock.unlockObject'));
    });
  },

  /**
    Depending on answer, open form read only or transition to parent route.

    @method _openReadOnly
    @param {Boolean} answer
    @param {function} resolve
    @param {function} reject
    @param {Object} reason
    @private
  */
  _openReadOnly(answer, resolve, reject, reason) {
    if (answer) {
      this.set('_readonly', true);
      resolve(reason);
    } else {
      this.controllerFor(this.routeName).transitionToParentRoute();
      reject();
    }
  },
});
