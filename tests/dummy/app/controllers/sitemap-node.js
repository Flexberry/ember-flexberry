import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    hideSidebar: function(direction) {
      Ember.$('.ui.sidebar').sidebar('hide');
    }
  }
});
