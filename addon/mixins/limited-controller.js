import Ember from 'ember';

export default Ember.Mixin.create({
  queryParams: ['lf', 'filter'],

  lf: null,

  filter: null,

  /**
   * Update current limit function.
   *
   * @method updateLimitFunction
   * @param {String} limitFunction New limit function.
   */
  updateLimitFunction: function(limitFunction) {
    if (this.get('lf') !== limitFunction) {
      // Changing lf value reloads route automatically.
      this.set('lf', limitFunction);
    }
  },

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
