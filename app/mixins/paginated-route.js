import Ember from 'ember';

/*
 This can be mixed into a route to provide pagination support.
 */
export default Ember.Mixin.create({
    // 'employees.page'
    paginationRoute: undefined,

    // This function is for use in a route that calls find() to get a
    // paginated collection of records.  It takes the pagination metadata
    // from the store and puts it into the record array.
    includePagination: function(records, page, per_page) {
        this.paginationRoute = this.paginationRoute || this.routeName;

        var metadata = records.store.typeMapFor(records.type).metadata;
        // put the pagination content directly on the collection
        records.set('pagination', {
            page: page,
            per_page: per_page,
            count: metadata.count
        });
        return records;
    },

    actions: {
        gotoPage: function(pageNum) {
            // this.get('controller.model.pagination') or this.get('controller.content.pagination')
            // (content is alias for model).
            var pagination = this.get('controller.content.pagination');
            var last = Math.ceil(pagination.count / pagination.per_page);
            var num = Math.max(1, Math.min(pageNum, last));
            this.transitionTo(this.paginationRoute, num);
        },
        nextPage: function() {
            var pagination = this.get('controller.content.pagination');
            var last = Math.ceil(pagination.count / pagination.per_page);
            var num = Math.max(1, Math.min(pagination.page + 1, last));
            this.transitionTo(this.paginationRoute, num);
        },
        previousPage: function() {
            var pagination = this.get('controller.content.pagination');
            var last = Math.ceil(pagination.count / pagination.per_page);
            var num = Math.max(1, Math.min(pagination.page - 1, last));
            this.transitionTo(this.paginationRoute, num, this.get('queryParams'));
        },
        lastPage: function() {
            var pagination = this.get('controller.content.pagination');
            var last = Math.ceil(pagination.count / pagination.per_page);
            this.transitionTo(this.paginationRoute, last, this.get('queryParams'));
        },
        firstPage: function() {
            this.transitionTo(this.paginationRoute, 1, this.get('queryParams'));
        }
    }
});
