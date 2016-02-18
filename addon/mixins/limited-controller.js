import Ember from 'ember';

export default Ember.Mixin.create({
  queryParams: ['lf'],
  lf: undefined,

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
  }
});
