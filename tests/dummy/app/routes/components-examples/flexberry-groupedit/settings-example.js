import EditFormRoute from 'ember-flexberry/routes/edit-form';
import DetailEnumeration from '../../../enums/components-examples/flexberry-groupedit/settings-example/detail-enumeration';

export default EditFormRoute.extend({
  modelProjection: 'AggregatorE',
  modelName: 'components-examples/flexberry-groupedit/settings-example/aggregator',
  model: function() {
    var store = this.get('store');
    var detail = store.createRecord('components-examples/flexberry-groupedit/settings-example/detail', {
      flag: true,
      text: 'Detail\'s text',
      date: new Date(),
      enumeration: DetailEnumeration.Value1,
      file: null,
      master: store.createRecord('components-examples/flexberry-groupedit/settings-example/master', {
        text: 'Detail\'s master text'
      })
    });

    var aggregator = store.createRecord('components-examples/flexberry-groupedit/settings-example/aggregator', {});
    aggregator.get('details').pushObject(detail);

    return aggregator;
  }
});
