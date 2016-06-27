import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    hideSidebar: function() {
      Ember.$('.ui.sidebar').sidebar('hide');
    }
  }
});
