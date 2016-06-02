import Ember from 'ember';

export default Ember.Route.extend({
  model: function(params) {
    var store = this.get('store');

    var base = store.createRecord('components-examples/flexberry-dropdown/settings-example/base', {});

    return base;
  }
});
