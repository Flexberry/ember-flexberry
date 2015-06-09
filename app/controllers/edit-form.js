import Ember from 'ember';
import ValidationData from '../objects/validation-data';
import ErrorableControllerMixin from 'prototype-ember-cli-application/mixins/errorable-controller';

export default Ember.Controller.extend(ErrorableControllerMixin, {
  actions: {
    save: function() {
      this.send('dismissErrorMessages');
      var model = this.get('model');
      model.save().then(function () {
        alert('Saved');
      }.bind(this), function (errorData) {
        if (errorData instanceof ValidationData) {
          if (errorData.anyErrors) {
            this.send('addErrorMessage', 'В модели присутствуют ошибки.');
            return;
          }
          if (errorData.noChanges) {
            alert('There are no changes');
            return;
          }
        }

        alert('Save failed');
        if (errorData && errorData.responseJSON) {
          var respJson = errorData.responseJSON;
          if (respJson && respJson.error && respJson.error.message){
            this.send('addErrorMessage', respJson.error.message);
          }
        }
      }.bind(this));
    },

    close: function() {
      // TODO: нужно учитывать пэйджинг.
      // Без сервера не обойтись, наверное. Нужно определять, на какую страницу редиректить.
      // Либо редиректить на что-то типа /{parentRoute}/page/whichContains/{object id}, а контроллер/роут там далее разрулит, куда дальше послать редирект.
      this.transitionToRoute(this.get('parentRoute'));
    }
  }
});
