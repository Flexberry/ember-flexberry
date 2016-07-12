import Ember from 'ember';
import EditFormController from 'ember-flexberry/controllers/edit-form';

export default EditFormController.extend({

  actions: {
    modalwindow: function() {
      var repeatWindow = Ember.$('#repeat-window').modal({ closable: false });
      this.set('repeatWindow', repeatWindow);
      this.get('repeatWindow').modal('refresh').modal('show');
    },

    modalwindowdouble: function() {
      var repeatWindow = Ember.$('#repeat-window-double').modal({ closable: false });
      this.set('repeatWindowdouble', repeatWindow);
      this.get('repeatWindowdouble').modal('refresh').modal('show');
    },

    logout: function() {
      this.get('repeatWindow').modal('hide');
    },

    logoutdouble: function() {
      this.get('repeatWindowdouble').modal('hide');
    }

  }
});
