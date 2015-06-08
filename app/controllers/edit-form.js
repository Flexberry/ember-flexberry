import Ember from 'ember';
import ErrorableControllerMixin from 'prototype-ember-cli-application/mixins/errorable-controller';

export default Ember.Controller.extend(ErrorableControllerMixin, {
  actions: {
    save: function() {
      this.send('dismissErrorMessages');

      var model = this.get('model');
      if (!model.get('isValid')) {
        this.send('addErrorMessage', 'В модели присутствуют ошибки.');
        return;
      }

      if (model.get('isDirty')) {
        model.save().then(function() {
          alert('Saved');
        }, function(ajaxError) {
          alert('Save failed');
          if (ajaxError){
            var jsonErrors = Ember.$.parseJSON(ajaxError.responseText);
            if (jsonErrors && jsonErrors.error && jsonErrors.error.message){
              this.send('addErrorMessage', jsonErrors.error.message);
            }
          }
        }.bind(this));
      } else {
        alert('There are no changes');
      }
    },

    close: function() {
      // TODO: нужно учитывать пэйджинг.
      // Без сервера не обойтись, наверное. Нужно определять, на какую страницу редиректить.
      // Либо редиректить на что-то типа /{parentRoute}/page/whichContains/{object id}, а контроллер/роут там далее разрулит, куда дальше послать редирект.
      this.transitionToRoute(this.get('parentRoute'));
    }
  },

  // Validation rules.
  validations: {
  },

  // Total number of validation errors.
  numTotalErrors: function () {
    return this.get('validators').mapBy('errors.length').reduce(
      function (beforeSum, addValue) {
        return beforeSum + addValue;
      }, 0);
  }.property('validators.@each.errors.length')
});
