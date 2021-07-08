import $ from 'jquery';
import { isNone } from '@ember/utils';
import EditFormController from 'ember-flexberry/controllers/edit-form';

export default EditFormController.extend({
  /**
    Defaul style of modal context.

    @property readonly
    @type String
    @default #example
  */
  _style:'#example',

  actions: {
    modalWindow(style) {
      if (!isNone(style)) {
        this.set('_style', style);
      }

      let repeatWindow = $('.repeat-window').modal({
        closable: false,
        autofocus: false,
        detachable: false,
        allowMultiple: true,
        context: this.get('_style'),
      });
      this.set('repeatWindow', repeatWindow);
      this.get('repeatWindow').modal('show').modal('refresh');
    },

    modalWindowDouble(style) {
      if (!isNone(style)) {
        this.set('_style', style);
      }

      let repeatWindow = $('.repeat-window-double').modal({
        closable: false,
        autofocus: false,
        detachable: false,
        allowMultiple: true,
        context: this.get('_style'),
      });
      this.set('repeatWindowdouble', repeatWindow);
      this.get('repeatWindowdouble').modal('show').modal('refresh');
    },

    logOut() {
      this.get('repeatWindow').modal('hide');
    },

    logOutDouble() {
      this.get('repeatWindowdouble').modal('hide');
    }

  }
});
