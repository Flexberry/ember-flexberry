import EditFormRoute from 'ember-flexberry/routes/edit-form';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import testEnum from '../enums/test-enumeration';

export default EditFormRoute.extend(AuthenticatedRouteMixin, {
  modelProjection: 'TestAggregatorE',
  modelName: 'test-aggregator',
  model: function(params) {
    var store = this.store;
    var detail = store.createRecord('test-detail', {
      flag: true,
      text: 'Detail\'s text',
      date: new Date(),
      enumeration: testEnum.Value2,
      file: null,
      master: store.createRecord('test-master', {
        text: 'Detail\'s master text'
      })
    });

    var aggregator = store.createRecord('test-aggregator', {});
    aggregator.get('details').pushObject(detail);

    return aggregator;
  }
});
