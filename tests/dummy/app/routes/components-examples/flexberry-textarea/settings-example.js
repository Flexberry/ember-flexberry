import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    var store = this.get('store');

    var base = store.createRecord('components-examples/flexberry-textarea/settings-example/base', {});

    return base;
  }
});
