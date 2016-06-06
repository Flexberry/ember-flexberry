/**
 * @module ember-flexberry
 */

import Ember from 'ember';
import SortableRouteMixin from '../mixins/sortable-route';
import PaginatedRouteMixin from '../mixins/paginated-route';
import LimitedRouteMixin from '../mixins/limited-route';
import FlexberryObjectlistviewRouteMixin from '../mixins/flexberry-objectlistview-route';
import ProjectedModelFormRoute from '../routes/projected-model-form';
import QueryBuilder from 'ember-flexberry-data/query/builder';
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
    sorting: [],

    model: function(params, transition) {
      let page = parseInt(params.page, 10);
      let perPage = parseInt(params.perPage, 10);

      Ember.assert('page must be greater than zero.', page > 0);
      Ember.assert('perPage must be greater than zero.', perPage > 0);

      let modelName = this.get('modelName');
      let moduleName = transition.targetName;
      let projectionName = this.get('modelProjection');  //At this stage we use routername as modulName for settings
      let serializer = this.store.serializerFor(modelName);

      //let sorting = this.deserializeSortingParam(params.sort);

      //get sorting parameters from DEFAULT userSettings
      let sortingPromise = this.get('_userSettingsService').getUserSetting({ moduleName: moduleName, settingName: 'DEFAULT' })
      .then(_userSettings => {
        let  _sorting = [];
        if (_userSettings) {
          this.userSettings =  _userSettings;
          _sorting = 'sorting' in this.userSettings ? this.userSettings.sorting : [];
        }

        return _sorting;
      });

      // find by query is always fetching.
      // TODO: support getting from cache with "store.all->filterByProjection".
      let ret = sortingPromise
      .then(
        sorting => {
          this.sorting = sorting;
          let builder = new QueryBuilder(this.store)
          .from(modelName)
          .selectByProjection(projectionName)
          .top(perPage)
          .skip((page - 1) * perPage)
          .count()
          .orderBy(
            sorting
            .map(i => `${serializer.keyForAttribute(i.propName)} ${i.direction}`)
            .join(',')
          );
          return this.store.query(modelName, builder.build());
        })
      .then((records) => {
        this.includeSorting(records, this.sorting, this.userSettings);
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
