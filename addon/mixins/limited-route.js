import Ember from 'ember';

export default Ember.Mixin.create({
  queryParams: {
    filter: { refreshModel: true }
  },

  filter: null
});
