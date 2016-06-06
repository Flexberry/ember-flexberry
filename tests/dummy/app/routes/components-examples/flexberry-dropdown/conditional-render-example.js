import EditFormRoute from 'ember-flexberry/routes/edit-form';

export default EditFormRoute.extend({
  modelProjection: 'BaseE',
  modelName: 'components-examples/flexberry-dropdown/conditional-render-example/base',
  model: function() {
    var store = this.get('store');

    var base = store.createRecord('components-examples/flexberry-dropdown/conditional-render-example/base', {
      enumeration: null
    });

    return base;
  }
});
