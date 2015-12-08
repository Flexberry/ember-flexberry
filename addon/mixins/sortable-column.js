import Ember from 'ember';

export default Ember.Mixin.create({
  sorted: false,
  sortNumber: -1, // 1-based
  sortAscending: true
});
