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
    var enumerationAvailableValues = enumeration.get('transformMap').captions;

    var aggregator = store.createRecord('test-aggregator', {});
    aggregator.enumerationAvailableValues = enumerationAvailableValues;

    return aggregator;
  }
});
