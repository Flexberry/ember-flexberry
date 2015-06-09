import Ember from 'ember';
import ErrorableControllerMixin from 'prototype-ember-cli-application/mixins/errorable-controller';

export default Ember.Controller.extend(ErrorableControllerMixin, {
  actions: {
    save: function() {
      this.send('dismissErrorMessages');
      var model = this.get('model');
      model.save().then(function (data){
        if (data.anyErrors) {
          this.send('addErrorMessage', 'В модели присутствуют ошибки.');
          return;
        }
        if (data.noChanges) {
          alert('There are no changes');
          return;
        }
        alert('Saved');
      }.bind(this), function (ajaxError) {
        alert('Save failed');
        if (ajaxError){
          var jsonErrors = Ember.$.parseJSON(ajaxError.responseText);
          if (jsonErrors && jsonErrors.error && jsonErrors.error.message){
            this.send('addErrorMessage', jsonErrors.error.message);
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
