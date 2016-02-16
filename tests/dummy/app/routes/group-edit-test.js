import EditFormRoute from 'ember-flexberry/routes/edit-form';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default EditFormRoute.extend(AuthenticatedRouteMixin, {
  modelProjection: 'GroupEditTestE',
  modelName: 'group-edit-test',
  model: function (params) {
    var store = this.store;

    var detail1Master = store.createRecord('group-edit-test-detail-master', {
      text: 'Detail №1 master text'
    });

    var detail1 = store.createRecord('group-edit-test-detail', {
      flag: true,
      text: 'Detail №1 text',
      date: new Date(),
      enumeration: 'Enum value №1',
      file: null,
      master: detail1Master
    });

    var aggregator = store.createRecord('group-edit-test', {});
    aggregator.get('details').pushObject(detail1);

    return aggregator;
  }
});
