import Ember from 'ember';

export default Ember.Mixin.create({
  queryParams: {
    lf: { refreshModel: true }
  },

  lf: null
});
