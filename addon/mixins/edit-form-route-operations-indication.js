/**
  @module ember-flexberry
*/

import Mixin from '@ember/object/mixin';
import RSVP from 'rsvp';

/**
  Edit forms routes mixin which handles save/delete operations indication.

  @class EditFormRouteOperationsIndicationMixin
*/
export default Mixin.create({
  /**
    Flag: indicates whether it's transition from new route or not.

    @property recordAdded.
    @type Boolean
    @default false
   */
  recordAdded: false,

  /**
    This hook is the first of the route entry validation hooks called when an attempt is made to transition into a route or one of its children.
    [More info](https://www.emberjs.com/api/ember/release/classes/Route/methods/beforeModel?anchor=beforeModel).

    @method beforeModel
    @param {Transition} transition
    @return {Promise}
  */
  beforeModel(transition) {
    let result = this._super(...arguments);

    if (!(result instanceof RSVP.Promise)) {
      result = RSVP.resolve();
    }

    return new RSVP.Promise((resolve, reject) => {
      result.then((parentResult) => {
        this.set('recordAdded', transition.to.queryParams.recordAdded || false);
        resolve(parentResult);
      }).catch((reason) => {
        reject(reason);
      });
    });
  },

  /**
    A hook you can use to setup the controller for the current route.
    [More info](https://www.emberjs.com/api/ember/release/classes/Route/methods/setupController?anchor=setupController).

    @method setupController
    @param {Controller} controller
  */
  setupController(controller) {
    this._super(...arguments);

    let recordAdded = this.get('recordAdded');
    controller.set('showFormSuccessMessage', recordAdded);
    if (recordAdded) {
      controller.set('latestOperationType', 'save');
    }
  },

  /**
    A hook you can use to reset controller values either when the model changes or the route is exiting.
    [More info](https://www.emberjs.com/api/ember/release/classes/Route/methods/resetController?anchor=resetController).

    @method resetController
    @param {Controller} controller
    @param {Boolean} isExisting
    @param {Object} transition
   */
  /* eslint-disable no-unused-vars */
  resetController: function(controller, isExisting, transition) {
    this._super.apply(this, arguments);

    controller.set('showFormSuccessMessage', false);
    controller.set('showFormErrorMessage', false);
  }
  /* eslint-enable no-unused-vars */
});
