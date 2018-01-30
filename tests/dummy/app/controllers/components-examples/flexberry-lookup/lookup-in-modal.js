import Ember from 'ember';
import EditFormController from 'ember-flexberry/controllers/edit-form';

export default EditFormController.extend({

  actions: {
    modalWindow() {
      let repeatWindow = Ember.$('#repeat-window').modal({
        closable: false,
        autofocus: false,
        detachable: false,
        allowMultiple: true,
      });
      this.set('repeatWindow', repeatWindow);
      this.get('repeatWindow').modal('refresh').modal('show');
    },

    modalWindowDouble() {
      let repeatWindow = Ember.$('#repeat-window-double').modal({
        closable: false,
        autofocus: false,
        detachable: false,
        allowMultiple: true,
      });
      this.set('repeatWindowdouble', repeatWindow);
      this.get('repeatWindowdouble').modal('refresh').modal('show');
    },

    logOut() {
      this.get('repeatWindow').modal('hide');
    },

    logOutDouble() {
      this.get('repeatWindowdouble').modal('hide');
    }
  }
});
