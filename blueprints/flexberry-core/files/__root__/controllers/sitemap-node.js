import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    hideSidebar() {
      Ember.$('.ui.sidebar').sidebar('hide');
    }
  }
});
