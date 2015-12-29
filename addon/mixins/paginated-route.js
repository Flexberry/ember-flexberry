import Ember from 'ember';

/*
 * This can be mixed into a route to provide pagination support.
 */
export default Ember.Mixin.create({
  queryParams: {
    page: { refreshModel: true },
    perPage: { refreshModel: true }
  },

  // This function is for use in a route that calls find() to get a
  // paginated collection of records.  It takes the pagination metadata
  // from the store and puts it into the record array.
  includePagination: function(records, page, perPage) {
    var metadata = records.store.typeMapFor(records.type).metadata;

    // Put the pagination content directly on the collection.
    records.set('pagination', {
      page: page,
      per_page: perPage,
      count: metadata.count
    });
    return records;
  },

  setupController: function(controller, model) {
    this._super(...arguments);
  }
});
