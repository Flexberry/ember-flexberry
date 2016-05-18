import Ember from 'ember';
import ODataAdapter from './application';

export default ODataAdapter.extend({
  db: Ember.inject.service('fake-db'),

  query(store, type, query) {
    return { value: this.get('db').select(type.modelName) };
  },

  queryRecord(store, type, query) {
    return this.get('db').getRecord(type.modelName, query.id);
  },

  createRecord(store, type, snapshot) {
    return this.get('db').createRecord(type.modelName, snapshot.serialize());
  },

  updateRecord(store, type, snapshot) {
    return this.get('db').updateRecord(type.modelName, snapshot.id, snapshot.serialize());
  },

  deleteRecord(store, type, snapshot) {
    return { EmployeeID : this.get('db').deleteRecord(type.modelName, snapshot.id) };
  },
});
