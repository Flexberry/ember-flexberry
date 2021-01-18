import Ember from 'ember';

export default Ember.Route.extend({
  /**
   * Returns model related to current route.
   *
   * @param params
   * @function model
   */
  model() {
    var store = Ember.get(this, 'store');

    var base = store.createRecord('components-examples/flexberry-checkbox/settings-example/base', { flag : null });

    return base;
  }
});
