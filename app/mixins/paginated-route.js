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

  _getLast: function (pagination = this.get('controller.content.pagination')) {
    return Math.ceil(pagination.count / pagination.per_page);
  },
  _getNum: function (pageNum, pagination = this.get('controller.content.pagination')) {
    var last = this._getLast(pagination);
    return Math.max(1, Math.min(pageNum, last));
  },

  transitionToPageRoute: function (pageNum){
    this.transitionTo(this.paginationRoute, pageNum);
  },

  actions: {
    gotoPage: function(pageNum) {
      // this.get('controller.model.pagination') or this.get('controller.content.pagination')
      // (content is alias for model).
      var num = this._getNum(pageNum);
      this.transitionToPageRoute(num);
    },
    nextPage: function() {
      var pagination = this.get('controller.content.pagination');
      var num = this._getNum(pagination.page + 1, pagination);
      this.transitionToPageRoute(num);
    },
    previousPage: function() {
      var pagination = this.get('controller.content.pagination');
      var num = this._getNum(pagination.page - 1, pagination);
      this.transitionToPageRoute(num);
    },
    lastPage: function() {
      var last = this._getLast();
      this.transitionToPageRoute(last);
    },
    firstPage: function() {
      this.transitionToPageRoute(1);
    }
  }
});
