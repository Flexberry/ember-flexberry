/**
 * @module ember-flexberry
 */

import Ember from 'ember';
import SortableRouteMixin from '../mixins/sortable-route';
import PaginatedRouteMixin from '../mixins/paginated-route';
import LimitedRouteMixin from '../mixins/limited-route';
import ReloadListMixin from '../mixins/reload-list-mixin';
import ProjectedModelFormRoute from '../routes/projected-model-form';

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
 */
export default ProjectedModelFormRoute.extend(
  PaginatedRouteMixin, SortableRouteMixin, LimitedRouteMixin, ReloadListMixin, {
  actions: {
    /**
     * Table row click handler.
     *
     * @param {Ember.Object} record Record related to clicked table row.
     */
    rowClick: function(record, editFormRoute) {
      this.transitionTo(editFormRoute, record.get('id'));
    },

    refreshList: function() {
      this.refresh();
    }
  },

  model: function(params, transition) {
    let sorting = this.deserializeSortingParam(params.sort);

    let projectionName = this.get('modelProjection');
    let relatedToType = this.get('modelName');
    let relatedTypeConstructor = this.store.modelFor(relatedToType);
    let projection = Ember.get(relatedTypeConstructor, 'projections')[projectionName];
    if (!projection) {
      throw new Error(`No projection with '${projectionName}' name defined in '${relatedToType}' model.`);
    }

    let queryParameters = {
      modelName: relatedToType,
      projectionName: projectionName,
      projection: projection,
      perPage: params.perPage,
      page: params.page,
      sorting: sorting,
      filter: params.filter
    };

    // find by query is always fetching.
    // TODO: support getting from cache with "store.all->filterByProjection".
    return this.reloadList(queryParameters).then((records) => {
      // TODO: move to setupController mixins?
      return this.includeSorting(records, sorting);
    });
  },

  setupController: function(controller, model) {
    this._super(...arguments);

    // Define 'modelProjection' for controller instance.
    // TODO: remove that when list-form controller will be moved to this route.
    let modelClass = this.store.modelFor(this.get('modelName'));
    let proj = modelClass.projections.get(this.get('modelProjection'));
    controller.set('modelProjection', proj);
  }
});
