import EditFormRoute from 'prototype-ember-cli-application/routes/edit-form';

export default EditFormRoute.extend({
    model: function() {
        this._modelIsFetched = true;
        var currentModel = this.store.createRecord(this.modelTypeKey);
        currentModel.set('_view', this.view);
        return currentModel;
    },

    renderTemplate: function(controller, model) {
        this.render(this.modelTypeKey, {
            model: model
        });
    },

    deactivate: function(){
        var model = this.get('controller').get('model');
        model.rollback();

        if (model.get('isNew')) {
            model.deleteRecord();
        }
    }
});
