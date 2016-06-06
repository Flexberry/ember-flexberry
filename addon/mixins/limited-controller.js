import Ember from 'ember';

export default Ember.Mixin.create({
  queryParams: ['filter'],

  filter: null,

  actions: {
    /**
     * Changes current pattern for objects filtering.
     *
     * @method filterByAnyMatch
     * @param {String} pattern A substring that is searched in objects while filtering.
     */
    filterByAnyMatch: function(pattern) {
      if (this.get('filter') !== pattern) {
        this.setProperties({
          filter: pattern,
          page: 1
        });
      }
    }
  }
});
