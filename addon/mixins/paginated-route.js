import Ember from 'ember';

/*
 * This can be mixed into a route to provide pagination support.
 */
export default Ember.Mixin.create({
  queryParams: {
    page: { refreshModel: true },
    perPage: { refreshModel: true }
  }
});
