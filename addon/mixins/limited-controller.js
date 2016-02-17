import Ember from 'ember';

export default Ember.Mixin.create({
  queryParams: ['lf'],
  lf: null,

  actions: {
    /**
     * Update current limit function.
     *
     * @method changeLimitFunction
     * @param {String} limitFunction New limit function.
     */
    changeLimitFunction: function(limitFunction) {
      if (this.get('lf') !== limitFunction) {
        // Changing lf value reloads route automatically.
        this.set('lf', limitFunction);
      }
    }
  }
});
