import Ember from 'ember';
import EditFormRoute from 'ember-flexberry/routes/edit-form';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

const { getOwner } = Ember;

export default EditFormRoute.extend(AuthenticatedRouteMixin, {
  modelProjection: 'TestAggregatorE',
  modelName: 'test-aggregator',
  model: function(params) {
    var store = this.store;

    var enumeration = getOwner(this).lookup('transform:test-enumeration');
    var enumerationAvailableValues = enumeration.getAvailableValuesArray();

    var detail = store.createRecord('test-detail', {
      flag: true,
      text: 'Detail\'s text',
      date: new Date(),
      enum: enumerationAvailableValues[0],
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
