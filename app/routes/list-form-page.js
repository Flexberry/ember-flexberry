import Ember from 'ember';
import SortableRouteMixin from '../mixins/sortable-route';
import PaginatedRouteMixin from '../mixins/paginated-route';
import ProjectedModelRoute from '../routes/base/projected-model-route';

export default ProjectedModelRoute.extend(PaginatedRouteMixin, SortableRouteMixin, {
  model: function(params, transition) {
    var page = parseInt(params.page, 10);
    var perPage = this.modelFor('application').get('perPage');

    Ember.assert('page must be greater than zero.', page > 0);
    Ember.assert('per_page must be greater than zero.', perPage > 0);

    var _this = this;
    var store = this.store;
    var modelName = this.get('modelName');
    var adapter = store.adapterFor(modelName);

    var sorting = _this.deserializeSortingParam(params.sort);
    var pageQuery = adapter.getPaginationQuery(page, perPage, sorting, store.serializerFor(modelName));

    // __fetchingProjection is tmp variable, which will be handled by adapter.findQuery.
    var query = Ember.merge(pageQuery, { __fetchingProjection: this.get('modelProjection') });

    // find by query is always fetching.
    // TODO: support getting from cache with "store.all->filterByProjection".
    return store.query(modelName, query)
      .then(function(records) {
        _this.includeSorting(records, sorting);
        return _this.includePagination(records, page, perPage);
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

    // Define 'modelProjection' for controller instance
    controller.set('modelProjection', this.get('modelProjection'));
  }
});
