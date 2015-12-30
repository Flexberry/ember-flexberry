import Ember from 'ember';
import SortableRouteMixin from '../mixins/sortable-route';
import PaginatedRouteMixin from '../mixins/paginated-route';
import ProjectedModelRoute from '../routes/projected-model-form';

export default ProjectedModelRoute.extend(PaginatedRouteMixin, SortableRouteMixin, {
  actions: {
    /**
     * Table row click handler.
     *
     * @param {Ember.Object} record Record related to clicked table row.
     */
    rowClick: function(record) {
      this.transitionTo(record.constructor.modelName, record.get('id'));
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
    let sortQuery = adapter.getSortingQuery(sorting, store.serializerFor(modelName));

    let query = {};
    Ember.merge(query, pageQuery);
    Ember.merge(query, sortQuery);
    Ember.merge(query, { projection: this.get('modelProjection') });

    // find by query is always fetching.
    // TODO: support getting from cache with "store.all->filterByProjection".
    return store.query(modelName, query)
      .then((records) => {
        // TODO: move to setupController mixins?
        return this.includeSorting(records, sorting);
      });
  },

  setupController: function(controller, model) {
    this._super(...arguments);

    // Define 'modelProjection' for controller instance.
    // TODO: remove that when list-form-page controller will be moved to this route.
    let modelClass = this.store.modelFor(this.get('modelName'));
    let proj = modelClass.projections.get(this.get('modelProjection'));
    controller.set('modelProjection', proj);
  }
});
