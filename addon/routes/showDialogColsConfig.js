import Ember from 'ember';

var colNames = [];

export default Ember.Route.extend({
  model() {
    return colNames;
  }
});
