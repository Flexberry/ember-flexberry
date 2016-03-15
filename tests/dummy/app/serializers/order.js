import ApplicationSerializer from './application';

export default ApplicationSerializer.extend({
  attrs: {
    employee: { serialize: 'odata-id', deserialize: 'records' },
    customer: { serialize: 'odata-id', deserialize: 'records' }
  },

  primaryKey: 'OrderID'
});
