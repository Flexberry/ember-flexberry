import Ember from 'ember';
import EmberValidations from 'ember-validations';

// Structure to show common errors.
var ErrorableControllerMixin = Ember.Mixin.create({
    init: function(){
        this._super();
        this.set('errorMessages', []);
    },

    actions:{
        addErrorMessage: function(msg){
            this.get('errorMessages').pushObject(msg);
        },

        dismissErrorMessages: function(){
            this.get('errorMessages').clear();
        }
    }
});

export default Ember.ObjectController.extend(EmberValidations.Mixin, ErrorableControllerMixin, {
    actions: {
        save: function() {
            this.send('dismissErrorMessages');
            if (this.get('numTotalErrors')) {
                this.send('addErrorMessage', 'В модели присутствуют ошибки.');
                return;
            }

            var model = this.get('model');
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
            // Либо редиректить на что-то типа /employees/page/whichContains/{object id}, а контроллер/роут там далее разрулит, куда дальше послать редирект.
            this.transitionTo('employees');
        }
    },

    // Validators.
    validations: {
        firstName: {
            presence: { message: ' значение не может быть пустым' },
            length: { minimum: 5, messages: { tooShort: ' значение должно быть минимум 5 символов'} }
        }
    },

    // Common number of validation errors.
    numTotalErrors: function () {
        return this.get('validators').mapBy('errors.length').reduce(
            function (beforeSum, addValue) {
                return beforeSum + addValue;
            }, 0);
    }.property('validators.@each.errors.length')
});
