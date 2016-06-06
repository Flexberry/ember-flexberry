import EditFormRoute from 'ember-flexberry/routes/edit-form';

export default EditFormRoute.extend({
  modelProjection: 'BaseE',
  modelName: 'components-examples/flexberry-lookup/settings-example/base',
  model: function() {
    var store = this.get('store');

    var base = store.createRecord('components-examples/flexberry-lookup/settings-example/base', {
      master: store.createRecord('components-examples/flexberry-lookup/settings-example/master', {
        flag: false,
        date: new Date(),
        text: 'Master\'s text'
      })
    });

    return base;
  }
});
