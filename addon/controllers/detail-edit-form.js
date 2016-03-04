/**
 * @module ember-flexberry
 */

import Ember from 'ember';
import EditFormController from './edit-form';

/**
 * Controller for the Detail's Edit Forms.
   It lets to interact between agregator's and details's forms.

   This class re-exports to the application as `/controllers/detail-edit-form`.
   So, you can inherit from `./detail-edit-form`, even if file `app/controllers/detail-edit-form.js`
   is not presented in the application.

   Example:
   ```js
   // app/controllers/order.js
   import DetailEditFormController from './detail-edit-form';
   export default DetailEditFormController.extend({
   });
   ```

 * @class DetailEditFormController
 * @extends EditFormController
 */
export default EditFormController.extend({
  /**
   * Flag to enable return to agregator's path if possible.
   * It overrides base default value.
   *
   * @property returnToAgregatorRoute
   * @type Boolean
   * @default true
   */
  returnToAgregatorRoute: true,

  /**
   * Service that lets interact between agregator's and detail's form.
   *
   * @property flexberryDetailInteractionService
   * @type Service
   */
  flexberryDetailInteractionService: Ember.inject.service('detail-interaction'),

  /**
   * Pathes to return to after leaving current route.
   *
   * @property modelCurrentAgregatorPathes
   * @type String
   * @default undefined
   */
  modelCurrentAgregatorPathes: undefined,

  /**
   * Current detail's agregators.
   *
   * @property modelCurrentAgregators
   * @type Object
   * @default undefined
   */
  modelCurrentAgregators: undefined,

  /**
   * Actions handlers.
   */
  actions: {
    /**
     * Handler for button 'save' click.
	 * If return path is determined, no rollback happens and user is redirected to agregator's form.
	 * Otherwise base logic is executed.
     *
     * @method save
     */
    save: function() {
      if (this._needReturnToAgregator()) {
        // If parent's route is defined, save on parent's route.
        this.transitionToParentRoute();
      } else {
        this._super.apply(this, arguments);
      }
    },

    /**
     * Handler for button 'delete' click.
	 * If return path is determined and current model is saved, record marks as deleted and user is redirected to agregator's form.
	 * Otherwise base logic is executed.
     *
     * @method delete
     */
    delete: function() {
      if (this.get('model').get('id') && this._needReturnToAgregator()) {
        if (confirm('Are you sure you want to delete that record?')) {
          this.get('model').deleteRecord();
          this.transitionToParentRoute();
        }
      } else {
        this._super.apply(this, arguments);
      }
    },

    /**
     * Handler for button 'close' click.
	 * If return path is determined, an error is thrown because this action should not be triggered.
	 * Otherwise base logic is executed.
     *
     * @method delete
     */
    close: function() {
      if (this._needReturnToAgregator()) {
        throw new Error('Execution of close action on linked with agregator detail\'s form should be forbidden.' +
          'Use at template somethong like: ' +
          '{{#unless (and (not modelCurrentAgregatorPath) model.isNew)}} ' +
          '<button type=\'submit\' class=\'ui negative button\' {{action \'delete\'}}>Delete</button>' +
          '{{/unless}}');
      } else {
        this._super.apply(this, arguments);
      }
    }
  },

  /**
   * Method to transit to parent's route (previous route).
   * If `modelAgregatorRoute` is set, transition to defined path and set flag 'modelNoRollBack' to `true` on controller to prevent rollback of model.
   * Then if `parentRoute` is set, transition to defined path.
   * Otherwise transition to corresponding list.
   *
   * @method transitionToParentRoute.
   */
  transitionToParentRoute: function() {
    if (this._needReturnToAgregator()) {
      this.set('modelNoRollBack', true);

      let modelAgregatorRoutes = this.get('modelCurrentAgregatorPathes');
      let modelAgregatorRoute = modelAgregatorRoutes.pop();
      let modelCurrentAgregators = this.get('modelCurrentAgregators');
      let modelCurrentAgregator = modelCurrentAgregators.pop();

      let flexberryDetailInteractionService = this.get('flexberryDetailInteractionService');
      flexberryDetailInteractionService.set('modelCurrentAgregatorPathes', modelAgregatorRoutes);
      flexberryDetailInteractionService.set('modelCurrentAgregators', modelCurrentAgregators);
      flexberryDetailInteractionService.set('modelLastUpdatedDetail', this.get('model'));
      if (modelCurrentAgregator && !modelCurrentAgregator.get('id')) {
        flexberryDetailInteractionService.set('modelCurrentNotSaved', modelCurrentAgregator);
      }

      this.transitionToRoute(modelAgregatorRoute);
    } else {
      this._super.apply(this, arguments);
    }
  },

  /**
   * Returns a logic value showing if there is return path from current form.
   *
   * @method _needReturnToAgregator
   * @private
   *
   * @return {Boolean} Logic value showing if there is return path from current form.
   */
  _needReturnToAgregator: function () {
    return this.get('flexberryDetailInteractionService').hasValues(this.get('modelCurrentAgregatorPathes'));
  }
});
