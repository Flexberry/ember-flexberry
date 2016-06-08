import EditFormRoute from 'ember-flexberry/routes/edit-form';

export default EditFormRoute.extend({
  modelProjection: 'SettingLookupExampleView',
  modelName: 'ember-flexberry-dummy-suggestion',
  model: function(params) {
    let store = this.get('store');
    let base = store.createRecord('ember-flexberry-dummy-suggestion');
    return base;
  }
});
