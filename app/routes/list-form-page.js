import Ember from 'ember';
import AuthenticatedRouteMixin from 'simple-auth/mixins/authenticated-route-mixin';
import PaginatedRouteMixin from 'prototype-ember-cli-application/mixins/paginated-route';
import SortableRouteMixin from 'prototype-ember-cli-application/mixins/sortable-route';

export default Ember.Route.extend(AuthenticatedRouteMixin, PaginatedRouteMixin, SortableRouteMixin, {
    // 'employee'
    modelTypeKey: undefined,

    // TODO: use view name instead? And rename __fetchingView to __fetchingViewName?
    view: undefined,

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

        // __fetchingView is tmp variable, which will be handled by adapter.findQuery.
        var query = Ember.merge(pageQuery, { __fetchingView: this.get('view') });

        // find by query is always fetching.
        // TODO: support getting from cache with "store.all->filterByView".
        return store.find(typeKey, query)
            .then(function(records) {
                self.includeSorting(records, sorting);
                return self.includePagination(records, page, perPage);
            });
    }
});
