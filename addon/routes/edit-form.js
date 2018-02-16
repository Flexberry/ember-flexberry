/**
  @module ember-flexberry
 */

import Ember from 'ember';
import ProjectedModelFormRoute from './projected-model-form';
import FlexberryGroupeditRouteMixin from '../mixins/flexberry-groupedit-route';
import FlexberryObjectlistviewRouteMixin from '../mixins/flexberry-objectlistview-route';
import FlexberryObjectlistviewHierarchicalRouteMixin from '../mixins/flexberry-objectlistview-hierarchical-route';
import ErrorableRouteMixin from '../mixins/errorable-route';

/**
  Base route for the Edit Forms.

  This class re-exports to the application as `/routes/edit-form`.
  So, you can inherit from `./edit-form`, even if file `app/routes/edit-form.js` is not presented in the application.

  Example:
  ```javascript
  // app/routes/employee.js
  import EditFormRoute from './edit-form';
  export default EditFormRoute.extend({
  });
  ```

  If you want to add some common logic on all Edit Forms, you can override `app/routes/edit-form.js` as follows:
  ```javascript
  // app/routes/edit-form.js
  import EditFormRoute from 'ember-flexberry/routes/edit-form';
  export default EditFormRoute.extend({
  });
  ```

  @class EditFormRoute
  @extends ProjectedModelForm
  @uses FlexberryGroupeditRouteMixin
 */
export default ProjectedModelFormRoute.extend(
FlexberryObjectlistviewRouteMixin,
FlexberryGroupeditRouteMixin,
FlexberryObjectlistviewHierarchicalRouteMixin,
ErrorableRouteMixin, {
  actions: {
    /**
      It sends message about transition to corresponding controller.

      The willTransition action is fired at the beginning of any attempted transition with a Transition object as the sole argument.
      [More info](http://emberjs.com/api/classes/Ember.Route.html#event_willTransition).

      @method actions.willTransition
      @param {Object} transition
     */
    willTransition(transition) {
      this._super(transition);
      this.controller.send('routeWillTransition');
    },
  },

  /**
    Configuration hash for this route's queryParams. [More info](http://emberjs.com/api/classes/Ember.Route.html#property_queryParams).

    @property queryParams
    @type Object
   */
  queryParams: {
    page: { refreshModel: false },
    perPage: { refreshModel: false },
    sort: { refreshModel: false },
    filter: { refreshModel: false },
    filterCondition: { refreshModel: false }
  },

  /**
    Suffix for new route (has value only on new routes).

    @property newSuffix
    @type String
  */
  newSuffix: undefined,

  /**
    Service that triggers objectlistview events.

    @property objectlistviewEventsService
    @type Service
  */
  objectlistviewEventsService: Ember.inject.service('objectlistview-events'),

  /**
    This hook is the first of the route entry validation hooks called when an attempt is made to transition into a route or one of its children.
    [More info](http://emberjs.com/api/classes/Ember.Route.html#method_beforeModel).

    @method beforeModel
    @param {Transition} transition
    @return {Promise}
  */
  beforeModel(transition) {
    this._super(...arguments);

    let webPage = transition.targetName;
    let newSuffix = this.get('newSuffix');
    if (!Ember.isBlank(newSuffix) && webPage.substr(webPage.length - newSuffix.length) === newSuffix) {
      webPage = webPage.substr(0, webPage.length - newSuffix.length);
    }

    let userSettingsService = this.get('userSettingsService');
    userSettingsService.setCurrentWebPage(webPage);
    let developerUserSettings = this.get('developerUserSettings') || {};

    let nComponents = 0;
    let componentName;
    for (componentName in developerUserSettings) {
      let componentDesc = developerUserSettings[componentName];
      switch (typeof componentDesc) {
        case 'string':
          developerUserSettings[componentName] = JSON.parse(componentDesc);
          break;
        case 'object':
          break;
        default:
          Ember.assert('Component description ' + 'developerUserSettings.' + componentName +
            'in /app/routes/' + transition.targetName + '.js must have types object or string', false);
      }
      nComponents += 1;
    }

    userSettingsService.setDefaultDeveloperUserSettings(developerUserSettings);
    return userSettingsService.setDeveloperUserSettings(developerUserSettings);
  },

  /**
    A hook you can implement to convert the URL into the model for this route.
    [More info](http://emberjs.com/api/classes/Ember.Route.html#method_model).

    @method model
    @param {Object} params
    @param {Object} transition
   */
  model(params, transition) {
    this._super.apply(this, arguments);

    let modelName = this.get('modelName');
    let modelProjName = this.get('modelProjection');

    // Get data from service in order to decide if it is necessary to reload data or not.
    // If already visited detail's route is observed or it is come back to agregators's route,
    // it is not necessary (otherwise data merge with loaded data can occur occasionally).
    let flexberryDetailInteractionService = this.get('flexberryDetailInteractionService');
    let modelCurrentNotSaved = flexberryDetailInteractionService.get('modelCurrentNotSaved');
    let modelSelectedDetail = flexberryDetailInteractionService.get('modelSelectedDetail');
    let needReload = !!(modelCurrentNotSaved || (modelSelectedDetail && modelSelectedDetail.get('hasDirtyAttributes')));

    // TODO: now 'findRecord' at ember-flexberry-projection not support 'reload: false' flag.
    let findRecordParameters = { reload: needReload, projection: modelProjName };

    // :id param defined in router.js
    return this.store.findRecord(modelName, params.id, findRecordParameters);
  },

  /**
    A hook you can use to reset controller values either when the model changes or the route is exiting.
    [More info](http://emberjs.com/api/classes/Ember.Route.html#method_resetController).

    @method resetController
    @param {Ember.Controller} controller
    @param {Boolean} isExisting
    @param {Object} transition
   */
  resetController(controller, isExisting, transition) {
    this._super.apply(this, arguments);
    let modelCurrentAgregators = controller.get('modelCurrentAgregators');
    let keptAgregators = modelCurrentAgregators && Ember.isArray(modelCurrentAgregators) ? modelCurrentAgregators.slice() : [];

    controller.send('dismissErrorMessages');
    controller.set('modelCurrentAgregatorPathes', undefined);
    controller.set('modelCurrentAgregators', undefined);

    // If flag 'modelNoRollBack' is set, leave current model as is and remove flag.
    if (controller.get('modelNoRollBack') === true) {
      controller.set('modelNoRollBack', false);
      return;
    }

    // If flag 'modelNoRollBack' is not set, we have to roll back this model and its agregators.
    let modelsToRollBack;
    let model = controller.get('model');
    if (this.get('flexberryDetailInteractionService').hasValues(keptAgregators)) {
      keptAgregators.push(model);
      keptAgregators.reverse();
      modelsToRollBack = keptAgregators;
    } else {
      modelsToRollBack = [model];
    }

    // Roll back all found agregators and its has-many relations.
    modelsToRollBack.forEach(function(processedModel) {
      if (processedModel) {
        processedModel.rollbackAll();
      }
    });
  },

  /**
    A hook you can use to setup the controller for the current route.
    [More info](http://emberjs.com/api/classes/Ember.Route.html#method_setupController).

    @method setupController
    @param {Ember.Controller} controller
    @param {Object} model
   */
  setupController(controller, model) {
    this._super(...arguments);

    // Define 'modelProjection' for controller instance.
    let modelClass = model.constructor;
    let modelProjName = this.get('modelProjection');
    let proj = modelClass.projections.get(modelProjName);
    controller.set('modelProjection', proj);
    controller.set('routeName', this.get('routeName'));
    controller.set('developerUserSettings', this.get('developerUserSettings'));
    if (Ember.isNone(controller.get('defaultDeveloperUserSettings'))) {
      controller.set('defaultDeveloperUserSettings', Ember.$.extend(true, {}, this.get('developerUserSettings')));
    }

    if (this.get('objectlistviewEventsService.loadingState') === 'loading') {
      this.get('objectlistviewEventsService').setLoadingState('');
    }

    let flexberryDetailInteractionService = this.get('flexberryDetailInteractionService');
    let modelCurrentAgregatorPath = flexberryDetailInteractionService.get('modelCurrentAgregatorPathes');
    let modelCurrentAgregator = flexberryDetailInteractionService.get('modelCurrentAgregators');
    let modelLastUpdatedDetail = flexberryDetailInteractionService.get('modelLastUpdatedDetail');
    let saveBeforeRouteLeave = flexberryDetailInteractionService.get('saveBeforeRouteLeave');

    flexberryDetailInteractionService.set('modelSelectedDetail', undefined);
    flexberryDetailInteractionService.set('modelCurrentAgregators', undefined);
    flexberryDetailInteractionService.set('modelCurrentAgregatorPathes', undefined);
    flexberryDetailInteractionService.set('saveBeforeRouteLeave', undefined);

    flexberryDetailInteractionService.set('modelCurrentNotSaved', undefined);
    flexberryDetailInteractionService.set('modelLastUpdatedDetail', undefined);

    if (modelLastUpdatedDetail &&
          ((modelLastUpdatedDetail.get('isDeleted') && modelLastUpdatedDetail.get('id')) ||
              modelLastUpdatedDetail.get('hasDirtyAttributes'))) {
      // If detail changed, agregator has to be marked as changed.
      model.makeDirty();
    }

    let returnToAgregatorRoute = controller.get('returnToAgregatorRoute');
    if (!returnToAgregatorRoute) {
      // There is no need to set parameters to return to agregator.
      return;
    }

    if (flexberryDetailInteractionService.hasValues(modelCurrentAgregatorPath)) {
      controller.set('modelCurrentAgregatorPathes', modelCurrentAgregatorPath);
      controller.set('modelCurrentAgregators', modelCurrentAgregator);
      controller.set('saveBeforeRouteLeave', saveBeforeRouteLeave);
    }
  },
});
