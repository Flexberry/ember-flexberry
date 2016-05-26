/**
 * @module ember-flexberry
 */

import Ember from 'ember';
import SortableRouteMixin from '../mixins/sortable-route';
import PaginatedRouteMixin from '../mixins/paginated-route';
import LimitedRouteMixin from '../mixins/limited-route';
import ProjectedModelFormRoute from '../routes/projected-model-form';
import ColsConfigDialogRoute from '../mixins/colsconfig-dialog-route';

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
 */
export default ProjectedModelFormRoute.extend(PaginatedRouteMixin, SortableRouteMixin, LimitedRouteMixin, ColsConfigDialogRoute, {

  _userSettingsService: Ember.inject.service('user-settings-service'),

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
    let page = parseInt(params.page, 10);
    let perPage = parseInt(params.perPage, 10);

    Ember.assert('page must be greater than zero.', page > 0);
    Ember.assert('perPage must be greater than zero.', perPage > 0);

    let store = this.store;
    let modelName = this.get('modelName');
    let adapter = store.adapterFor(modelName);

    let pageQuery = adapter.getPaginationQuery(page, perPage);

    let sorting = this.deserializeSortingParam(params.sort);

    let modelClass = this.store.modelFor(this.get('modelName'));
    let proj = modelClass.projections.get(this.get('modelProjection'));
    let filterString = this.getFilterString(proj, params);
    let limitFunctionQuery = adapter.getLimitFunctionQuery(filterString);

    let query = {};
    Ember.merge(query, pageQuery);
    Ember.merge(query, limitFunctionQuery);
    Ember.merge(query, { projection: this.get('modelProjection') });

    //At this stage we use routername as modulName for settings
    let moduleName=transition.targetName;
    /**
     * userSettings from user-settings-service'),
     */
    let userSettings={};
    var ret=this.get('_userSettingsService').getUserSetting({moduleName:moduleName,settingName:'DEFAULT'})
    .then( (_userSettings) => {
      return _userSettings;
    })
    .catch ( (error)=> {
        alert(error);
        return {};
    })
    .then( _userSettings=> {
      userSettings=_userSettings;
      sorting=this._appenduserSettingsToSorting(sorting,_userSettings); //Append sorting orders from _userSettings
      let sortQuery = adapter.getSortingQuery(sorting, store.serializerFor(modelName));
      Ember.merge(query, sortQuery);
      return store.query(modelName, query)
    })
    .then((records) => {
      return this.includeSorting(records, sorting, userSettings);
    });
    return ret;
    // find by query is always fetching.
    // TODO: support getting from cache with "store.all->filterByProjection".
//     return store.query(modelName, query)
//       .then((records) => {
//         // TODO: move to setupController mixins?
//         return this.includeSorting(records, sorting);
//       });
  },

  setupController: function(controller, model) {
    this._super(...arguments);

    // Define 'modelProjection' for controller instance.
    // TODO: remove that when list-form controller will be moved to this route.
    let modelClass = this.store.modelFor(this.get('modelName'));
    let proj = modelClass.projections.get(this.get('modelProjection'));
    controller.set('modelProjection', proj);
  },

  _appenduserSettingsToSorting: function (sorting,userSettings) {
    let sortedPropNames={};
    for (let i=0; i<sorting.length; i++ ) {
      let propName=sorting[i].propName;
      sortedPropNames[propName]=true;
    }
    let sortSettings=[];
    for (let i=0; i<userSettings.length; i++ ) {
      if ('sortPriority' in userSettings[i]) {
        sortSettings[sortSettings.length]=userSettings[i];
      }
    }
    let sortedUserSettings=sortSettings.sort((a,b) => a.sortPriority-b.sortPriority);
    for (let i=0; i<sortedUserSettings.length; i++ ) {
      let propName=sortedUserSettings[i].propName;
      if (! (propName in sortedPropNames) ) {
        sorting[sorting.length]= {propName:propName,direction: sortedUserSettings[i].sortOrder < 0 ? 'asc': 'desc'};
      }
    }
    return sorting;
  }
});
