import DS from 'ember-data';
import ApplicationSerializer from '../serializers/application';

export default ApplicationSerializer.extend(DS.EmbeddedRecordsMixin, {
  attrs: {
    employee1: { serialize: 'id', deserialize: 'records' },
    orders: { serialize: false, deserialize: 'records' }
  },

  primaryKey: 'EmployeeID'
});
