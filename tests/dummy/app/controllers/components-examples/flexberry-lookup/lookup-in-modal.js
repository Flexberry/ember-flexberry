import $ from 'jquery';
import EditFormController from 'ember-flexberry/controllers/edit-form';

export default EditFormController.extend({

  actions: {
    modalWindow() {
      let repeatWindow = $('#repeat-window').modal({
        closable: false,
        autofocus: false,
        detachable: false,
        allowMultiple: true,
        context: '#example',
      });
      this.set('repeatWindow', repeatWindow);
      this.get('repeatWindow').modal('refresh').modal('show');
    },

    modalWindowDouble() {
      let repeatWindow = $('#repeat-window-double').modal({
        closable: false,
        autofocus: false,
        detachable: false,
        allowMultiple: true,
        context: '#example',
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
