/**
  @module ember-flexberry
*/

import Ember from 'ember';
import LimitedRouteMixin from '../mixins/limited-route';
import SortableRouteMixin from '../mixins/sortable-route';
import PaginatedRouteMixin from '../mixins/paginated-route';
import ProjectedModelFormRoute from '../routes/projected-model-form';
import FlexberryObjectlistviewRouteMixin from '../mixins/flexberry-objectlistview-route';
import FlexberryObjectlistviewHierarchicalRouteMixin from '../mixins/flexberry-objectlistview-hierarchical-route';
import ReloadListMixin from '../mixins/reload-list-mixin';
import ErrorableRouteMixin from '../mixins/errorable-route';
import serializeSortingParam from '../utils/serialize-sorting-param';
import deserializeSortingParam from '../utils/deserialize-sorting-param';

/**
  Base route for the List Forms.

  This class re-exports to the application as `/routes/list-form`.
  So, you can inherit from `./list-form`, even if file `app/routes/list-form.js` is not presented in the application.

  @example
    ```javascript
    // app/routes/employees.js
    import ListFormRoute from './list-form';
    export default ListFormRoute.extend({
    });
    ```

    If you want to add some common logic on all List Forms, you can override `app/routes/list-form.js` as follows:
    ```javascript
    // app/routes/list-form.js
    import ListFormRoute from 'ember-flexberry/routes/list-form';
    export default ListFormRoute.extend({
    });
    ```

  @class ListFormRoute
  @extends ProjectedModelFormRoute
  @uses PaginatedRouteMixin
  @uses SortableRouteMixin
  @uses LimitedRouteMixin
  @uses ReloadListMixin
  @uses FlexberryObjectlistviewRouteMixin
*/
export default ProjectedModelFormRoute.extend(
PaginatedRouteMixin,
SortableRouteMixin,
LimitedRouteMixin,
ReloadListMixin,
FlexberryObjectlistviewRouteMixin,
FlexberryObjectlistviewHierarchicalRouteMixin,
ErrorableRouteMixin, {
  /**
    Link on {{#crossLink FormLoadTimeTrackerService}}{{/crossLink}}.

    @property formLoadTimeTracker
    @type FormLoadTimeTrackerService
    @private
  */
  formLoadTimeTracker: Ember.inject.service(),

  /**
    Current sorting.

    @property sorting
    @type Array
    @default []
  */
  sorting: [],

  /**
    @property colsConfigMenu
    @type Service
  */
  colsConfigMenu: Ember.inject.service(),

  /**
    Service for managing the state of the application.

    @property appState
    @type AppStateService
  */
  appState: Ember.inject.service(),

  /**
    Service for managing advLimits for lists.

    @property advLimit
    @type AdvLimitService
  */
  advLimit: Ember.inject.service(),

  /**
    A hook you can implement to convert the URL into the model for this route.
    [More info](http://emberjs.com/api/classes/Ember.Route.html#method_model).

    @method model
    @param {Object} params
    @param {Object} transition
  */
  model: function(params, transition) {
    this.get('formLoadTimeTracker').set('startLoadTime', performance.now());

    let controller = this.controllerFor(this.routeName);
    this.get('appState').loading();

    let modelName = this.get('modelName');
    let webPage = transition.targetName;
    let projectionName = this.get('modelProjection');
    let filtersPredicate = this._filtersPredicate();
    let sortString = null;
    this.set('filtersPredicate', filtersPredicate);
    let limitPredicate =
      this.objectListViewLimitPredicate({ modelName: modelName, projectionName: projectionName, params: params });
    let userSettingsService = this.get('userSettingsService');
    userSettingsService.setCurrentWebPage(webPage);
    let advLimitService = this.get('advLimit');
    advLimitService.setCurrentAppPage(webPage);
    let developerUserSettings = this.get('developerUserSettings');
    Ember.assert('Property developerUserSettings is not defined in /app/routes/' + transition.targetName + '.js', developerUserSettings);

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

    if (nComponents === 0) {
      Ember.assert('Developer MUST DEFINE component settings in /app/routes/' + transition.targetName + '.js', false);
    }

    Ember.assert('Developer MUST DEFINE SINGLE components settings in /app/routes/' + transition.targetName + '.js' + nComponents + ' defined.',
      nComponents === 1);
    userSettingsService.setDefaultDeveloperUserSettings(developerUserSettings);
    let userSettingPromise = userSettingsService.setDeveloperUserSettings(developerUserSettings);
    let listComponentNames = userSettingsService.getListComponentNames();
    componentName = listComponentNames[0];
    userSettingsService.checkDeletedAtributes(this.get('store'), modelName, componentName);
    
    Ember.RSVP.all([userSettingPromise, advLimitService.getAdvLimitsFromStore(Object.keys(developerUserSettings))])
      .then(() => {
        if (this._invalidSorting(params.sort)) {
          controller.set('isSortingError', true);
          transition.abort();
          throw new Error('Invalid sorting value');
        }

        if (params) {
          sortString = userSettingsService.setCurrentParams(componentName, params);
        }

        let hierarchicalAttribute;
        if (controller.get('inHierarchicalMode')) {
          hierarchicalAttribute = controller.get('hierarchicalAttribute');
        }

        this.sorting = userSettingsService.getCurrentSorting(componentName);

        this.perPage = userSettingsService.getCurrentPerPage(componentName);
        if (this.perPage !== params.perPage || serializeSortingParam(this.sorting) !== params.sort) {
          if (params.perPage !== 5) {
            this.perPage = params.perPage;
            userSettingsService.setCurrentPerPage(componentName, undefined, this.perPage);
          } else {
            if (this.sorting.length === 0) {
              this.transitionTo(this.currentRouteName, { queryParams:  Ember.$.extend(params, { sort: null, perPage: this.perPage || 5 }) }); // Show page without sort parameters
            } else {
              this.transitionTo(this.currentRouteName, { queryParams: Ember.$.extend(params, { sort: sortString, perPage: this.perPage || 5 }) });  //Reload current page and records (model) list
            }
          }
        }

        const advLimit = advLimitService.getCurrentAdvLimit(componentName);

        let queryParameters = {
          componentName: componentName,
          modelName: modelName,
          projectionName: projectionName,
          perPage: this.perPage,
          page: params.page,
          sorting: this.sorting,
          filter: params.filter,
          filterCondition: controller.get('filterCondition'),
          filters: filtersPredicate,
          predicate: limitPredicate,
          advLimit: advLimit,
          hierarchicalAttribute: hierarchicalAttribute,
          hierarchyPaging: controller.get('hierarchyPaging')
        };

        this.onModelLoadingStarted(queryParameters, transition);
        this.get('colsConfigMenu').updateNamedSettingTrigger(componentName);
        this.get('colsConfigMenu').updateNamedAdvLimitTrigger(componentName);

        // Find by query is always fetching.
        // TODO: support getting from cache with "store.all->filterByProjection".
        // TODO: move includeSorting to setupController mixins?
        return this.reloadList(queryParameters);
      }).then((records) => {
        this.get('formLoadTimeTracker').set('endLoadTime', performance.now());
        this.onModelLoadingFulfilled(records, transition);
        this.includeSorting(records, this.sorting);
        controller.set('model', records);

        if (this.sorting.length > 0 && Ember.isNone(controller.get('sort'))) {
          let sortQueryParam = serializeSortingParam(this.sorting, controller.get('sortDefaultValue'));
          controller.set('sort', sortQueryParam);
        }

        return records;
      }).catch((errorData) => {
        this.onModelLoadingRejected(errorData, transition);
      }).finally((data) => {
        this.onModelLoadingAlways(data, transition);
        this.get('appState').reset();
      });

    // TODO: Check controller loaded model loading parameters and return it without reloading if there is same backend query was executed.
    let model = this.get('controller.model');

    if (Ember.isNone(model)) {
      return { isLoading: true };
    } else {
      return model;
    }
  },

  /**
    This method will be invoked before model loading operation will be called.
    Override this method to add some custom logic on model loading operation start.

    @example
      ```javascript
      onModelLoadingStarted(queryParameters, transition) {
        alert('Model loading operation started!');
      }
      ```
    @method onModelLoadingStarted.
    @param {Object} queryParameters Query parameters used for model loading operation.
    @param {Transition} transition Current transition object.
  */
  onModelLoadingStarted(queryParameters, transition) {
  },

  /**
    This method will be invoked when model loading operation successfully completed.
    Override this method to add some custom logic on model loading operation success.

    @example
      ```javascript
      onModelLoadingFulfilled(model, transition) {
        alert('Model loading operation succeed!');
      }
      ```
    @method onModelLoadingFulfilled.
    @param {Object} model Loaded model data.
    @param {Transition} transition Current transition object.
  */
  onModelLoadingFulfilled(model, transition) {
  },

  /**
    This method will be invoked when model loading operation completed, but failed.
    Override this method to add some custom logic on model loading operation fail.
    By default showing error form.

    @example
      ```javascript
      onModelLoadingRejected(errorData, transition) {
        alert('Model loading operation failed!');
      }
      ```
    @method onModelLoadingRejected.
    @param {Object} errorData Data about model loading operation fail.
    @param {Transition} transition Current transition object.
  */
  onModelLoadingRejected(errorData, transition) {
    this.handleError(errorData, transition);
  },

  /**
    This method will be invoked always when model loading operation completed,
    regardless of model loading promise's state (was it fulfilled or rejected).
    Override this method to add some custom logic on model loading operation completion.

    @example
      ```js
      onModelLoadingAlways(data, transition) {
        alert('Model loading operation completed!');
      }
      ```

    @method onModelLoadingAlways.
    @param {Object} data Data about completed model loading operation.
    @param {Transition} transition Current transition object.
  */
  onModelLoadingAlways(data, transition) {
  },

  /**
    A hook you can use to setup the controller for the current route.
    [More info](http://emberjs.com/api/classes/Ember.Route.html#method_setupController).

    @method setupController
    @param {<a href="http://emberjs.com/api/classes/Ember.Controller.html">Ember.Controller</a>} controller
    @param {Object} model
  */
  setupController: function(controller, model) {
    this._super(...arguments);

    if (Ember.isNone(this.get('multiListSettings'))) {
      this.get('formLoadTimeTracker').set('startRenderTime', performance.now());

      // Define 'modelProjection' for controller instance.
      // TODO: remove that when list-form controller will be moved to this route.
      let modelClass = this.store.modelFor(this.get('modelName'));
      let proj = modelClass.projections.get(this.get('modelProjection'));
      controller.set('error', undefined);
      controller.set('userSettings', this.userSettings);
      controller.set('modelProjection', proj);
      controller.set('developerUserSettings', this.get('developerUserSettings'));
      controller.set('resultPredicate', this.get('resultPredicate'));
      controller.set('filtersPredicate', this.get('filtersPredicate'));
      if (Ember.isNone(controller.get('defaultDeveloperUserSettings'))) {
        controller.set('defaultDeveloperUserSettings', Ember.$.extend(true, {}, this.get('developerUserSettings')));
      }
    }
  },

  /**
    @method _invalidSorting
    @param {String} sorting
    @return {Boolean}
  */
  _invalidSorting(sorting) {
    let invalid = false;
    let store = this.get('store');

    deserializeSortingParam(sorting).forEach((descriptor) => {
      let path = descriptor.propName.split('.');
      let propertyName = path.pop();

      let modelClass = store.modelFor(this.get('modelName'));
      for (let i = 0; i < path.length; i++) {
        let relationshipsByName = Ember.get(modelClass, 'relationshipsByName');
        let relationship = relationshipsByName.get(path[i]);
        if (relationship) {
          modelClass = store.modelFor(relationship.type);
        } else {
          invalid = true;
        }
      }

      invalid = invalid || !Ember.get(modelClass, 'attributes').get(propertyName);
    });

    return invalid;
  },
});
