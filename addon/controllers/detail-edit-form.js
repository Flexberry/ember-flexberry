/**
  @module ember-flexberry
*/

import Ember from 'ember';
import EditFormController from './edit-form';

/**
  Controller for the Detail's Edit Forms.
  It lets to interact between agregator's and details's forms.

  This class re-exports to the application as `/controllers/detail-edit-form`.
  So, you can inherit from `./detail-edit-form`, even if file `app/controllers/detail-edit-form.js` is not presented in the application.

  Example:
  ```javascript
  // app/controllers/order.js
  import DetailEditFormController from './detail-edit-form';
  export default DetailEditFormController.extend({
  });
  ```

  @class DetailEditFormController
  @extends EditFormController
*/
export default EditFormController.extend({
  /**
    Service that lets interact between agregator's and detail's form.

    @property flexberryDetailInteractionService
    @type Ember.Service
    @readOnly
    @private
  */
  _flexberryDetailInteractionService: Ember.inject.service('detail-interaction'),

  /**
    A logic value showing if current route has parent one.

    @property _hasParentRoute
    @type Boolean
    @private
    @readOnly
  */
  _hasParentRoute: Ember.computed('modelCurrentAgregatorPathes', function() {
    return this.get('_flexberryDetailInteractionService').hasValues(this.get('modelCurrentAgregatorPathes'));
  }),

  /**
    Flag to enable return to agregator's path if possible.
    It overrides base default value.

    @property returnToAgregatorRoute
    @type Boolean
    @default true
  */
  returnToAgregatorRoute: true,

  /**
    Paths to return to after leaving current route.

    @property modelCurrentAgregatorPathes
    @type Array
  */
  modelCurrentAgregatorPathes: undefined,

  /**
    Current detail's agregators.

    @property modelCurrentAgregators
    @type Array
  */
  modelCurrentAgregators: undefined,

  /**
    Flag: indicates whether to save current model before going to the detail's route.
    This flag is set to `true` when this form is opened from agregator's form.

    @property saveBeforeRouteLeave
    @type Boolean
    @default false
  */
  saveBeforeRouteLeave: false,

  actions: {
    /**
      Handler for button 'Save' click.
      If return path is determined, no rollback happens and user is redirected to agregator's form.
      Otherwise base logic is executed.

      @method actions.save
    */
    save() {
      if (this.get('_hasParentRoute') && !this.get('saveBeforeRouteLeave')) {
        throw new Error('\'Save\' operation is not accessible due to current settings.');
      }
      let modelAgregatorRoutes = this.get('modelCurrentAgregatorPathes');
      let modelCurrentAgregators = this.get('modelCurrentAgregators');
      let flexberryDetailInteractionService = this.get('_flexberryDetailInteractionService');
      flexberryDetailInteractionService.set('modelCurrentAgregatorPathes', modelAgregatorRoutes);
      flexberryDetailInteractionService.set('modelCurrentAgregators', modelCurrentAgregators);
      this._super.apply(this, arguments);
    },

    /**
      Handler for button 'Save and close' click.
      If return path is determined, no rollback happens and user is redirected to agregator's form.
      Otherwise base logic is executed.

      @method actions.saveAndClose
    */
    saveAndClose() {
      if (this.get('_hasParentRoute') && !this.get('saveBeforeRouteLeave')) {
        throw new Error('\'Save and close\' operation is not accessible due to current settings.');
      }

      this._super.apply(this, arguments);
    },

    /**
      Handler for button 'Delete' click.
      If return path is determined and current model is saved, record marks as deleted and user is redirected to agregator's form.
      Otherwise base logic is executed.

      @method actions.delete
    */
    delete() {
      if (this.get('model').get('id') && this.get('_hasParentRoute') && !this.get('saveBeforeRouteLeave')) {
        if (confirm('Are you sure you want to delete that record?')) {
          this.get('model').deleteRecord();
          this.transitionToParentRoute();
        }
      } else {
        this._super.apply(this, arguments);
      }
    },

    /**
      Handler for button 'Close' click.
      If return path is determined, an error is thrown because this action should not be triggered.
      Otherwise base logic is executed.

      @method actions.close
    */
    close() {
      if (!this.get('_hasParentRoute')) {
        this._super.apply(this, arguments);
        return;
      }

      if (this.get('saveBeforeRouteLeave')) {
        this.transitionToParentRoute(true);
        return;
      }

      // If 'saveBeforeRouteLeave' == false & 'close' button has been pressed,
      // before transition to parent route we should validate model and then upload files
      // (if some file components are present on current detail rout),
      // because after transition, all components correspondent to current detail route (including file components)
      // gonna be destroyed, and files won't be uploaded at all.
      let model = this.get('model');
      model.validate().then(() => model.beforeSave({ softSave: true })).then(() => {
        this.transitionToParentRoute(false);
      }, (reason) => {
        this.rejectError(reason);
      });
    }
  },

  /**
    Method to transit to parent's route (previous route).
    If `modelAgregatorRoute` is set, transition to defined path and set flag 'modelNoRollBack' to `true` on controller to prevent rollback of model.
    Then if `parentRoute` is set, transition to defined path.
    Otherwise transition to corresponding list.

    @method transitionToParentRoute
    @param {Boolean} rollBackModel Flag: indicates whether to set flag to roll back model after route leave (if `true`) or not (if `false`).
  */
  transitionToParentRoute(rollBackModel) {
    if (this.get('_hasParentRoute')) {
      if (!rollBackModel) {
        this.set('modelNoRollBack', true);
      }

      let modelAgregatorRoutes = this.get('modelCurrentAgregatorPathes');
      let modelAgregatorRoute = modelAgregatorRoutes.pop();
      let modelCurrentAgregators = this.get('modelCurrentAgregators');
      let modelCurrentAgregator = modelCurrentAgregators.pop();

      let flexberryDetailInteractionService = this.get('_flexberryDetailInteractionService');
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
