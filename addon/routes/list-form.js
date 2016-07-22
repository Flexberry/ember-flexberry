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

/**
  Base route for the List Forms.

  This class re-exports to the application as `/routes/list-form`.
  So, you can inherit from `./list-form`, even if file `app/routes/list-form.js` is not presented in the application.

  Example:
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
  FlexberryObjectlistviewHierarchicalRouteMixin, {
  /**
    Current sorting.

    @property sorting
    @type Array
    @default []
  */
  sorting: [],

  /**
    A hook you can implement to convert the URL into the model for this route.
    [More info](http://emberjs.com/api/classes/Ember.Route.html#method_model).

    @method model
    @param {Object} params
    @param {Object} transition
  */
  model: function(params, transition) {
    let modelName = this.get('modelName');
    let webPage = transition.targetName;
    let projectionName = this.get('modelProjection');
    let limitPredicate =
      this.objectListViewLimitPredicate({ modelName: modelName, projectionName: projectionName, params: params });
    let userSettingsService = this.get('userSettingsService');
    userSettingsService.setCurrentWebPage(webPage);
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
    let userSettingPromise = userSettingsService.setDeveloperUserSettings(developerUserSettings);
    let listComponentNames = userSettingsService.getListComponentNames();
    componentName = listComponentNames[0];
    let ret = userSettingPromise
      .then(currectPageUserSettings => {
        if (params) {
          userSettingsService.setCurrentParams(componentName, params);
        }

        this.sorting = userSettingsService.getCurrentSorting(componentName);
        let queryParameters = {
          modelName: modelName,
          projectionName: projectionName,
          perPage: params.perPage,
          page: params.page,
          sorting: this.sorting,
          filter: params.filter,
          predicate: limitPredicate
        };

        // Find by query is always fetching.
        // TODO: support getting from cache with "store.all->filterByProjection".
        // TODO: move includeSorting to setupController mixins?
        return this.reloadList(queryParameters);
      }).then((records) => {
        this.includeSorting(records, this.sorting);
        return records;
      });
    return ret;
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

    // Define 'modelProjection' for controller instance.
    // TODO: remove that when list-form controller will be moved to this route.
    let modelClass = this.store.modelFor(this.get('modelName'));
    let proj = modelClass.projections.get(this.get('modelProjection'));
    controller.set('userSettings', this.userSettings);
    controller.set('modelProjection', proj);
  },
});
