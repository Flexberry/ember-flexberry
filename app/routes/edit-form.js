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

    resetController: function(controller, isExisting, transition) {
        this._super.apply(arguments);

        controller.send('dismissErrorMessages');
        var model = controller.get('model');
        if (model && model.get('isDirty')) {
            model.rollback();
        }
    }
});
