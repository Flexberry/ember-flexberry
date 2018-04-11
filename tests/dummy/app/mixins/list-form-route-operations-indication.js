/**
  @module ember-flexberry-dummy
*/

import Mixin from '@ember/object/mixin';

/**
  Edit forms routes mixin which handles load/delete operations indication.

  @class ListFormRouteOperationsIndicationMixin
*/
export default Mixin.create({

  /* eslint-disable no-unused-vars */
  setupController: function(controller, model) {
    this._super.apply(this, arguments);

    this.set('copyController', controller);
    controller.set('showFormSuccessMessage', false);
    controller.set('showFormErrorMessage', false);
  },
  /* eslint-enable no-unused-vars */

  /**
    @property copyController.
   */
  copyController: undefined,

  /**
    This method will be invoked before load operation will be called.

    @method onModelLoadingStarted.
    @param {Object} queryParameters
    @param {Transition} transition Current transition object.
   */
  /* eslint-disable no-unused-vars */
  onModelLoadingStarted(queryParameters, transition) {
    this._super(...arguments);

    let controller = this.get('copyController');
    controller.set('latestOperationType', 'load');
  },
  /* eslint-enable no-unused-vars */

  /**
    This method will be invoked when load operation successfully completed.

    @method onModelLoadingFulfilled.
    @param {Object} records
    @param {Transition} transition Current transition object.
   */
  /* eslint-disable no-unused-vars */
  onModelLoadingFulfilled(records, transition) {
    this._super(...arguments);

    let controller = this.get('copyController');
    controller.set('showFormSuccessMessage', true);
    controller.set('showFormErrorMessage', false);
  },
  /* eslint-enable no-unused-vars */

  /**
    This method will be invoked when load operation completed, but failed.

    @method onModelLoadingRejected.
    @param {Object} errorData Data about load operation fail.
    @param {Transition} transition Current transition object.
   */
  /* eslint-disable no-unused-vars */
  onModelLoadingRejected(errorData, transition) {
    this._super(...arguments);

    let controller = this.get('copyController');
    controller.set('showFormSuccessMessage', false);
    controller.set('showFormErrorMessage', true);
  },
  /* eslint-enable no-unused-vars */

  /**
    This method will be invoked always when load operation completed,
    regardless of load promise's state (was it fulfilled or rejected).

    @method onModelLoadingAlways.
    @param {Object} data Data about completed load operation.
    @param {Transition} transition Current transition object.
   */
  /* eslint-disable no-unused-vars */
  onModelLoadingAlways(data, transition) {
    this._super(...arguments);
  }
  /* eslint-enable no-unused-vars */
});
