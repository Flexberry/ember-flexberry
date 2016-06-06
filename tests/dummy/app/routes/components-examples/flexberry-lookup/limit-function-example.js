import EditFormRoute from 'ember-flexberry/routes/edit-form';

export default EditFormRoute.extend({
  modelProjection: 'LookupWithLimitFunctionExampleView',
  modelName: 'ember-flexberry-dummy-suggestion',
  model: function() {
    let store = this.get('store');
    let base = store.createRecord('ember-flexberry-dummy-suggestion');
    return base;
  }
});
