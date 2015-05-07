import Ember from 'ember';
import EmberValidations from 'ember-validations';
import ErrorableControllerMixin from 'prototype-ember-cli-application/mixins/errorable-controller';

// TODO: Ember.ObjectController is deprecated, please use Ember.Controller.
// But validations don't work using Ember.Controller.
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
            // Либо редиректить на что-то типа /orders/page/whichContains/{object id}, а контроллер/роут там далее разрулит, куда дальше послать редирект.
            this.transitionToRoute('orders');
        }
    },

    // Validators.
    validations: {
        orderDate: {
            presence: true
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
