import Ember from 'ember';
import SortableRouteMixin from '../mixins/sortable-route';
import PaginatedRouteMixin from '../mixins/paginated-route';
import ProjectedModelRoute from '../routes/projected-model-form';
import Settings from '../models/settings';

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
    var page = parseInt(params.page, 10);

    let settings = Settings.create();
    let perPage = settings.get('perPage');

    Ember.assert('page must be greater than zero.', page > 0);
    Ember.assert('per_page must be greater than zero.', perPage > 0);

    var store = this.store;
    var modelName = this.get('modelName');
    var adapter = store.adapterFor(modelName);

    let pageQuery = adapter.getPaginationQuery(page, perPage);
    var sorting = this.deserializeSortingParam(params.sort);
    let sortQuery = adapter.getSortingQuery(sorting, store.serializerFor(modelName));

    let query = {};
    Ember.merge(query, pageQuery);
    Ember.merge(query, sortQuery);
    Ember.merge(query, { projection: this.get('modelProjection') });

    // find by query is always fetching.
    // TODO: support getting from cache with "store.all->filterByProjection".
    return store.query(modelName, query)
      .then((records) => {
        this.includeSorting(records, sorting);
        return this.includePagination(records, page, perPage);
      });
  },

  // A hook you can use to setup the controller for the current route.
  setupController: function(controller, model) {
    // Call _super for default behavior.
    this._super(controller, model);

    // Implement your custom setup after.

    var currentPage = this._getCurrent();
    var lastPage = this._getLast();
    if (currentPage > lastPage) {
      // After changing records number per page there is possibility that current page is greater then last one.
      // In this case we have to change current page to last.
      this.transitionToPageRoute(lastPage);
      return;
    }

    // Define 'modelProjection' for controller instance.
    // TODO: remove that when list-form-page controller will be moved to this route.
    let modelClass = this.store.modelFor(this.get('modelName'));
    let proj = modelClass.projections.get(this.get('modelProjection'));
    controller.set('modelProjection', proj);
  }
});
