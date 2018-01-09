/**
  @module ember-flexberry-dummy
*/

import Ember from 'ember';

/**
  Edit forms routes mixin which handles load/delete operations indication.

  @class ListFormRouteOperationsIndicationMixin
*/
export default Ember.Mixin.create({

  setupController: function(controller, model) {
    this._super.apply(this, arguments);

    this.set('copyController', controller);
    controller.set('showFormSuccessMessage', false);
    controller.set('showFormErrorMessage', false);
  },

  /**
    @property copyController.
   */
  copyController: undefined,

  /**
    This method will be invoked before load operation will be called.

    @method onModelLoadingStarted.
    @param {Object} queryParameters
   */
  onModelLoadingStarted(queryParameters) {
    this._super(...arguments);

    let controller = this.get('copyController');
    controller.set('latestOperationType', 'load');
  },

  /**
    This method will be invoked when load operation successfully completed.

    @method onModelLoadingFulfilled.
    @param {Object} records
   */
  onModelLoadingFulfilled(records) {
    this._super(...arguments);

    let controller = this.get('copyController');
    controller.set('showFormSuccessMessage', true);
    controller.set('showFormErrorMessage', false);
  },

  /**
    This method will be invoked when load operation completed, but failed.

    @method onModelLoadingRejected.
    @param {Object} errorData Data about load operation fail.
   */
  onModelLoadingRejected(errorData) {
    this._super(...arguments);

    let controller = this.get('copyController');
    controller.set('showFormSuccessMessage', false);
    controller.set('showFormErrorMessage', true);
  },

  /**
    This method will be invoked always when load operation completed,
    regardless of load promise's state (was it fulfilled or rejected).

    @method onModelLoadingAlways.
    @param {Object} data Data about completed load operation.
   */
  onModelLoadingAlways(data) {
    this._super(...arguments);
  }
});
