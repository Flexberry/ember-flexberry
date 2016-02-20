import Ember from 'ember';

export default Ember.Mixin.create({
  queryParams: {
    lf: { refreshModel: true }
  },

  lf: null,

  /**
   * Update limit function query parameter and reloads route if needed.
   *
   * @param {String} limitFunction New limit function to set.
   * @param {Object} params Route parameters (it is used when limit function changes in beforeModel hook).
   */
  updateLimitFunction: function(limitFunction, params) {
    if (!params) {
      this.transitionTo({ queryParams: limitFunction });
    } else {
      if (params && params.lf !== limitFunction) {
        params.lf = limitFunction;
        this.transitionTo({ queryParams: params });
      }
    }
  }
});
