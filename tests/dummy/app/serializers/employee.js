import ApplicationSerializer from '../serializers/application';

export default ApplicationSerializer.extend({
  attrs: {
    employee1: { serialize: 'odata-id', deserialize: 'records' },
    orders: { serialize: false, deserialize: 'records' }
  },

  primaryKey: 'EmployeeID'
});
