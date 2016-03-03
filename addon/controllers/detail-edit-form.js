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
    save: function() {
      let modelAgregatorRoute = this.get('modelCurrentAgregatorPath');
      if (modelAgregatorRoute) {
        // If parent's route is defined, save on parent's route.
        this.transitionToParentRoute();
      } else {
        this._super.apply(this, arguments);
      }
    },

    delete: function() {
      // TODO: interract with agregator.
    },

    close: function() {
      // TODO: close should be without saving.
      this.transitionToParentRoute();
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
      this.get('flexberryDetailInteractionService').set('modelCurrentNotSaved', this.get('modelCurrentAgregator'));
      this.transitionToRoute(modelAgregatorRoute);
    } else {
      this._super.apply(this, arguments);
    }
  }
});
