import Ember from 'ember';

export default Ember.Controller.extend({

  actions: {
    setIndeterminate() {
      Ember.set(this, 'model.flag', null);
    }
  }
});
