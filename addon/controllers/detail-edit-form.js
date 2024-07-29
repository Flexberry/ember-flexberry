/**
  @module ember-flexberry
*/

import { computed } from '@ember/object';
import { getOwner } from '@ember/application';
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
    A logic value showing if current route has parent one.

    @property _hasParentRoute
    @type Boolean
    @private
    @readOnly
  */
  _hasParentRoute: computed('modelCurrentAgregatorPathes', function() {
    let flexberryDetailInteractionService = this.get('_flexberryDetailInteractionService');
    let modelAgregatorRoutes = flexberryDetailInteractionService.get('modelCurrentAgregatorPathes');
    return flexberryDetailInteractionService.hasValues(this.get('modelCurrentAgregatorPathes')) ||
      flexberryDetailInteractionService.hasValues(modelAgregatorRoutes);
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
      this._super.apply(this, arguments);
    },

    /**
      Handler for button 'Save and close' click.
      If return path is determined, no rollback happens and user is redirected to agregator's form.
      Otherwise base logic is executed.

      @method actions.saveAndClose
      @param {Boolean} skipTransition If `true`, then transition during close form process will be skipped after save.
    */
    /* eslint-disable no-unused-vars */
    saveAndClose(skipTransition) {
      this._super.apply(this, arguments);
    },
    /* eslint-enable no-unused-vars */

    /**
      Handler for button 'Delete' click.
      If return path is determined and current model is saved, record marks as deleted and user is redirected to agregator's form.
      Otherwise base logic is executed.

      @method actions.delete
      @param {Boolean} skipTransition If `true`, then transition during close form process will be skipped after delete.
    */
    delete(skipTransition) {
      if (this.get('model').get('id') && this.get('_hasParentRoute') && !this.get('saveBeforeRouteLeave')) {
        if (confirm('Are you sure you want to delete that record?')) {
          this.get('model').deleteRecord();
          this.transitionToParentRoute(skipTransition, false);
        }
      } else {
        this.delete(skipTransition);
      }
    },

    /**
      Handler for button 'Close' click.
      If return path is determined, an error is thrown because this action should not be triggered.
      Otherwise base logic is executed.

      @method actions.close
      @param {Boolean} skipTransition If `true`, then transition during close form process will be skipped.
      @param {Boolean} rollBackModel Flag: indicates whether to set flag to roll back model after route leave (if `true`) or not (if `false`).
    */
    close(skipTransition, rollBackModel) {
      this.close(skipTransition, rollBackModel);
    },
  },

  /**
    Сlose edit form and transition to parent route.

    @method close
    @param {Boolean} skipTransition If `true`, then transition during close form process will be skipped.
    @param {Boolean} rollBackModel Flag: indicates whether to set flag to roll back model after route leave (if `true`) or not (if `false`).
  */
  /* eslint-disable no-unused-vars */
  close(skipTransition, rollBackModel) {
    this._setFlexberryDetailInteractionSettings();
    if (!this.get('_hasParentRoute')) {
      this._super.apply(this, arguments);
      return;
    }

    if (this.get('saveBeforeRouteLeave')) {
      this._super.apply(this, [skipTransition, true]);
      return;
    }

    // If 'saveBeforeRouteLeave' == false & 'close' button has been pressed,
    // before transition to parent route we should validate model and then upload files
    // (if some file components are present on current detail rout),
    // because after transition, all components correspondent to current detail route (including file components)
    // gonna be destroyed, and files won't be uploaded at all.
    let model = this.get('model');
    model.validateModel().then(() => model.beforeSave({ softSave: true })).then(() => {
      this._super.apply(this, [skipTransition, false]);
    }, (reason) => {
      this.rejectError(reason);
    });
  },
  /* eslint-enable no-unused-vars */

  /**
    Save object.

    @method save
    @param {Boolean} close If `true`, then save and close.
    @param {Boolean} skipTransition If `true`, then transition after save process will be skipped.
    @return {Promise}
  */
  /* eslint-disable no-unused-vars */
  save(close, skipTransition) {
    this._saveInternalLogic();
    return this._super(...arguments);
  },
  /* eslint-enable no-unused-vars */

  /**
    Delete object, if successful transition to parent route.

    @method delete
    @param {Boolean} skipTransition If `true`, then transition during close form process will be skipped after delete.
    @return {Promise}
  */
  /* eslint-disable no-unused-vars */
  delete(skipTransition) {
    this._setFlexberryDetailInteractionSettings();
    return this._super(...arguments);
  },
  /* eslint-enable no-unused-vars */

  /**
    Method to transit to parent's route (previous route).
    If `modelAgregatorRoute` is set, transition to defined path and set flag 'modelNoRollBack' to `true` on controller to prevent rollback of model.
    Then if `parentRoute` is set, transition to defined path.
    Otherwise transition to corresponding list.

    @method transitionToParentRoute
    @param {Boolean} skipTransition If `true`, then transition will be skipped.
    @param {Boolean} rollBackModel Flag: indicates whether to set flag to roll back model after route leave (if `true`) or not (if `false`).
  */
  transitionToParentRoute(skipTransition, rollBackModel) {
    if (this.get('_hasParentRoute')) {
      if (!rollBackModel) {
        this.set('modelNoRollBack', true);
      }

      let flexberryDetailInteractionService = this.get('_flexberryDetailInteractionService');
      let modelAgregatorRoutes = this.get('modelCurrentAgregatorPathes') ? this.get('modelCurrentAgregatorPathes') :
        flexberryDetailInteractionService.get('modelCurrentAgregatorPathes');
      let modelAgregatorRoute = modelAgregatorRoutes.pop();
      let modelCurrentAgregators = this.get('modelCurrentAgregators') ? this.get('modelCurrentAgregators') :
        flexberryDetailInteractionService.get('modelCurrentAgregators');
      let modelCurrentAgregator = modelCurrentAgregators.pop();

      flexberryDetailInteractionService.set('modelCurrentAgregatorPathes', modelAgregatorRoutes);
      flexberryDetailInteractionService.set('modelCurrentAgregators', modelCurrentAgregators);
      flexberryDetailInteractionService.set('modelLastUpdatedDetail', this.get('model'));
      if (modelCurrentAgregator) {
        let store = getOwner(this).lookup('service:store');
        let agregatorIsOfflineModel = modelCurrentAgregator && store.get('offlineModels') &&
          store.get(`offlineModels.${modelCurrentAgregator.constructor.modelName}`);

        if (this.get('offlineGlobals.isOnline') && !agregatorIsOfflineModel) {
          flexberryDetailInteractionService.set('modelCurrentNotSaved', modelCurrentAgregator);
        }
      }

      if (!skipTransition) {
        if (modelAgregatorRoute.indexOf('/new') > 0 && modelCurrentAgregator.get('id')) {
          modelAgregatorRoute = modelAgregatorRoute.slice(1, -4);
        }

        this.transitionToRoute(modelAgregatorRoute, modelCurrentAgregator);
      }
    } else {
      this._super.apply(this, arguments);
    }
  },

  _saveInternalLogic() {
    if (this.get('_hasParentRoute') && !this.get('saveBeforeRouteLeave')) {
      throw new Error('\'Save\' operation is not accessible due to current settings.');
    }

    this._setFlexberryDetailInteractionSettings();
  },

  _setFlexberryDetailInteractionSettings() {
    let modelAgregatorRoutes = this.get('modelCurrentAgregatorPathes');
    let modelCurrentAgregators = this.get('modelCurrentAgregators');
    let saveBeforeRouteLeave = this.get('saveBeforeRouteLeave');
    let flexberryDetailInteractionService = this.get('_flexberryDetailInteractionService');
    flexberryDetailInteractionService.set('modelCurrentAgregatorPathes', modelAgregatorRoutes);
    flexberryDetailInteractionService.set('modelCurrentAgregators', modelCurrentAgregators);
    flexberryDetailInteractionService.set('saveBeforeRouteLeave', saveBeforeRouteLeave);
  }
});
