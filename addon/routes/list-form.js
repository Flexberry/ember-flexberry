/**
 * @module ember-flexberry
 */

import Ember from 'ember';
import SortableRouteMixin from '../mixins/sortable-route';
import PaginatedRouteMixin from '../mixins/paginated-route';
import LimitedRouteMixin from '../mixins/limited-route';
import FlexberryObjectlistviewRouteMixin from '../mixins/flexberry-objectlistview-route';
import ProjectedModelFormRoute from '../routes/projected-model-form';
import ReloadListMixin from '../mixins/reload-list-mixin';

/**
 * Base route for the List Forms.

 This class re-exports to the application as `/routes/list-form`.
 So, you can inherit from `./list-form`, even if file `app/routes/list-form.js`
 is not presented in the application.

 Example:
 ```js
 // app/routes/employees.js
 import ListFormRoute from './list-form';
 export default ListFormRoute.extend({
 });
 ```
 If you want to add some common logic on all List Forms, you can define
 (actually override) `app/routes/list-form.js` as follows:
 ```js
 // app/routes/list-form.js
 import ListFormRoute from 'ember-flexberry/routes/list-form';
 export default ListFormRoute.extend({
 });
 ```

 * @class ListFormRoute
 * @extends ProjectedModelFormRoute
 * @uses PaginatedRouteMixin
 * @uses SortableRouteMixin
 * @uses LimitedRouteMixin
 * @uses ReloadListMixin
 * @uses FlexberryObjectlistviewRouteMixin
 */

export default ProjectedModelFormRoute.extend(
  PaginatedRouteMixin,
  SortableRouteMixin,
  LimitedRouteMixin,
  ReloadListMixin,
  FlexberryObjectlistviewRouteMixin, {
    _userSettingsService: Ember.inject.service('user-settings-service'),
    userSettings: {},
    listUserSettings: {},
    sorting: [],

    model: function(params, transition) {
      let modelName = this.get('modelName');
      let moduleName = transition.targetName;
      let projectionName = this.get('modelProjection');  //At this stage we use routername as modulName for settings
      let limitPredicate =
        this.objectListViewLimitPredicate({ modelName: modelName, projectionName: projectionName, params: params });
      let userSettingPromise = this.get('_userSettingsService').getUserSettings({ moduleName: moduleName })  //get sorting parameters from DEFAULT userSettings
      .then(_listUserSettings => {
        if (!_listUserSettings) { //UserSetting  switch off
          _listUserSettings = { DEFAULT: { sorting: this.deserializeSortingParam(params.sort) } };
        }

        return _listUserSettings;
      });

      let ret = userSettingPromise
      .then(
        listUserSettings=> {
          this.listUserSettings = listUserSettings;
          let sorting = [];
          this.userSettings = {};
          if ('DEFAULT' in listUserSettings) {
            this.userSettings = this.listUserSettings.DEFAULT;
            sorting = 'sorting' in this.userSettings ? this.userSettings.sorting : [];
          }

          this.sorting = sorting;

          let queryParameters = {
            modelName: modelName,
            projectionName: projectionName,
            perPage: params.perPage,
            page: params.page,
            sorting: sorting, // TODO: there can be some problems.
            filter: params.filter,
            predicate: limitPredicate
          };

          // Find by query is always fetching.
          // TODO: support getting from cache with "store.all->filterByProjection".
          // TODO: move includeSorting to setupController mixins?
          return this.reloadList(queryParameters);
        })
      .then((records) => {
        this.includeSorting(records, this.sorting);
        records.set('userSettings', this.userSettings);
        records.set('listUserSettings', this.listUserSettings);
        return records;
      });
      return ret;
    },

    setupController: function(controller, model) {
      this._super(...arguments);

      // Define 'modelProjection' for controller instance.
      // TODO: remove that when list-form controller will be moved to this route.
      let modelClass = this.store.modelFor(this.get('modelName'));
      let proj = modelClass.projections.get(this.get('modelProjection'));
      controller.set('userSettings', this.userSettings);
      controller.set('modelProjection', proj);
    }
  }
);
