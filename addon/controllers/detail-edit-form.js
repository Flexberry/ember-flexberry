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
   * Route to return to after leaving current route.
   *
   * @property modelCurrentAgregatorPath
   * @type String
   * @default undefined
   */
  modelCurrentAgregatorPath: undefined,

  /**
   * Current detail's agregator (this parameter is used only for not saved agregators).
   *
   * @property modelCurrentAgregator
   * @type Object
   * @default undefined
   */
  modelCurrentAgregator: undefined,

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
      let modelAgregatorRoute = this.get('modelCurrentAgregatorPath');
      if (modelAgregatorRoute) {
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
      let modelAgregatorRoute = this.get('modelCurrentAgregatorPath');
      if (this.get('model').get('id') && modelAgregatorRoute) {
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
      let modelAgregatorRoute = this.get('modelCurrentAgregatorPath');
      if (modelAgregatorRoute) {
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
    let modelAgregatorRoute = this.get('modelCurrentAgregatorPath');
    if (modelAgregatorRoute) {
      this.set('modelNoRollBack', true);
      let flexberryDetailInteractionService = this.get('flexberryDetailInteractionService');
      let modelCurrentAgregator = this.get('modelCurrentAgregator');
      flexberryDetailInteractionService.set('modelLastUpdatedDetail', this.get('model'));
      if (modelCurrentAgregator && !modelCurrentAgregator.get('id')) {
        flexberryDetailInteractionService.set('modelCurrentNotSaved', modelCurrentAgregator);
      }

      this.transitionToRoute(modelAgregatorRoute);
    } else {
      this._super.apply(this, arguments);
    }
  }
});
