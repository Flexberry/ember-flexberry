import EditFormRoute from 'ember-flexberry/routes/edit-form';
import Enumeration from '../../../enums/components-examples/flexberry-dropdown/settings-example/enumeration';

export default EditFormRoute.extend({
  modelProjection: 'BaseE',
  modelName: 'components-examples/flexberry-dropdown/settings-example/base',
  model: function(params) {
    var store = this.get('store');

    var base = store.createRecord('components-examples/flexberry-dropdown/settings-example/base', {
      enumeration: Enumeration.Value1
    });

    return base;
  }
});
