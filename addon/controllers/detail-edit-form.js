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
   * @type Array
   * @default undefined
   */
  modelCurrentAgregatorPathes: undefined,

  /**
   * Current detail's agregators.
   *
   * @property modelCurrentAgregators
   * @type Array
   * @default undefined
   */
  modelCurrentAgregators: undefined,

  /**
   * Flag: indicates whether to save current model before going to the detail's route.
   * This flag is set to `true` when this form is opened from agregator's form.
   *
   * @property saveBeforeRouteLeave
   * @type Boolean
   * @default false
   */
  saveBeforeRouteLeave: false,

  /**
   * A logic value showing if current route has parent one.
   *
   * @property hasParentRoute
   * @type Boolean
   * @default undefined
   */
  hasParentRoute: Ember.computed('modelCurrentAgregatorPathes', function() {
    return this.get('flexberryDetailInteractionService').hasValues(this.get('modelCurrentAgregatorPathes'));
  }),

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
      if (this.get('hasParentRoute') || !this.get('saveBeforeRouteLeave')) {
        throw new Error('\'Save\' operation is not accessible due to current settings.');
      }

      this._super.apply(this, arguments);
    },

    saveAndClose: function() {
      if (this.get('hasParentRoute') && !this.get('saveBeforeRouteLeave')) {
        throw new Error('\'Save and close\' operation is not accessible due to current settings.');
      }

      this._super.apply(this, arguments);
    },

    /**
     * Handler for button 'delete' click.
     * If return path is determined and current model is saved, record marks as deleted and user is redirected to agregator's form.
     * Otherwise base logic is executed.
     *
     * @method delete
     */
    delete: function() {
      if (this.get('model').get('id') && this.get('hasParentRoute') && !this.get('saveBeforeRouteLeave')) {
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
      if (this.get('hasParentRoute')) {
        this.transitionToParentRoute(this.get('saveBeforeRouteLeave'));
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
   *
   * @param {Boolean} rollBackModel Flag: indicates whether to set flag to roll back model after route leave (if `true`) or not (if `false`).
   */
  transitionToParentRoute: function(rollBackModel) {
    if (this.get('hasParentRoute')) {
      if (rollBackModel) {
        this.set('modelNoRollBack', true);
      }

      let modelAgregatorRoutes = this.get('modelCurrentAgregatorPathes');
      let modelAgregatorRoute = modelAgregatorRoutes.pop();
      let modelCurrentAgregators = this.get('modelCurrentAgregators');
      let modelCurrentAgregator = modelCurrentAgregators.pop();

      let flexberryDetailInteractionService = this.get('flexberryDetailInteractionService');
      flexberryDetailInteractionService.set('modelCurrentAgregatorPathes', modelAgregatorRoutes);
      flexberryDetailInteractionService.set('modelCurrentAgregators', modelCurrentAgregators);
      flexberryDetailInteractionService.set('modelLastUpdatedDetail', this.get('model'));
      if (modelCurrentAgregator) {
        flexberryDetailInteractionService.set('modelCurrentNotSaved', modelCurrentAgregator);
      }

      this.transitionToRoute(modelAgregatorRoute);
    } else {
      this._super.apply(this, arguments);
    }
  }
});
