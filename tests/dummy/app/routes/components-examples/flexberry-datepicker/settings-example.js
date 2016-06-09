import Ember from 'ember';

export default Ember.Route.extend({
  /**
    Returns model related to current route.

    @method model
   */
  model(params) {
    var store = this.get('store');

    var base = store.createRecord('components-examples/flexberry-datepicker/settings-example/base', {});

    return base;
  }
});
