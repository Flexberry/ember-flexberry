import Ember from 'ember';
import SortableRouteMixin from '../mixins/sortable-route';
import PaginatedRouteMixin from '../mixins/paginated-route';
import ProjectedModelRoute from '../routes/base/projected-model-route';

export default ProjectedModelRoute.extend(PaginatedRouteMixin, SortableRouteMixin, {
  model: function(params, transition) {
    var page = parseInt(params.page, 10),
        perPage = this.modelFor('application').get('perPage');

    Ember.assert('page must be greater than zero.', page > 0);
    Ember.assert('per_page must be greater than zero.', perPage > 0);

    var self = this,
        store = this.store,
        typeKey = this.get('modelTypeKey'),
        adapter = store.adapterFor(store.modelFor(typeKey));

    var sorting = self.deserializeSortingParam(params['sort']);
    var pageQuery = adapter.getPaginationQuery(page, perPage, sorting, store.serializerFor(typeKey));

    // __fetchingProjection is tmp variable, which will be handled by adapter.findQuery.
    var query = Ember.merge(pageQuery, { __fetchingProjection: this.get('modelProjection') });

    // find by query is always fetching.
    // TODO: support getting from cache with "store.all->filterByProjection".
    return store.find(typeKey, query)
      .then(function(records) {
        self.includeSorting(records, sorting);
        return self.includePagination(records, page, perPage);
      });
  },

  // A hook you can use to setup the controller for the current route.
  setupController: function (controller, model) {
    // Call _super for default behavior
    this._super(controller, model);
    // Implement your custom setup after

    var currentPage = this._getCurrent();
    var lastPage = this._getLast();
    if (currentPage > lastPage){
      // After changing records number per page there is possibility that current page is greater then last one.
      // In this case we have to change current page to last.
      this.transitionToPageRoute(lastPage);
      return;
    }

    // Define 'modelProjection' for controller instance
    controller.set('modelProjection', this.get('modelProjection'));
  }
});
