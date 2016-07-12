import Ember from 'ember';
import EditFormController from 'ember-flexberry/controllers/edit-form';

export default EditFormController.extend({

  actions: {
    modalwindow() {
      let repeatWindow = Ember.$('#repeat-window').modal({
        closable: false,
        autofocus: false,
      });
      this.set('repeatWindow', repeatWindow);
      this.get('repeatWindow').modal('refresh').modal('show');
    },

    modalwindowdouble() {
      let repeatWindow = Ember.$('#repeat-window-double').modal({
        closable: false,
        autofocus: false,
      });
      this.set('repeatWindowdouble', repeatWindow);
      this.get('repeatWindowdouble').modal('refresh').modal('show');
    },

    logout() {
      this.get('repeatWindow').modal('hide');
    },

    logoutdouble() {
      this.get('repeatWindowdouble').modal('hide');
    }
  }
});
