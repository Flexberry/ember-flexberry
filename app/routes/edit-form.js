import Ember from 'ember';
import FetchModelRoute from 'prototype-ember-cli-application/routes/fetch-model';

export default FetchModelRoute.extend({
    view: Ember.required(),
    modelTypeKey: Ember.required(),

    model: function(params, transition) {
        this._super(params, transition);

        var store = this.store;

        // :id param defined in router.js
        return store.findOneByView(this.modelTypeKey, params.id, this.view);
    },

    beforeModel: function(transition, queryParams){
        // Без этого не отрабатывает запрос на авторизацию.
        this._super(transition, queryParams);

        var controller = this.get('controller');
        if (controller) {
            controller.send('dismissErrorMessages');
            var oldModel = controller.get('model');
            if (oldModel && oldModel.get('isDirty')) {
                oldModel.rollback();
            }
        }
    }
});
