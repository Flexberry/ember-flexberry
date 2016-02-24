import DS from 'ember-data';
import ApplicationSerializer from './application';

export default ApplicationSerializer.extend(DS.EmbeddedRecordsMixin, {
  attrs: {
    employee: { serialize: 'records', deserialize: 'records' },
    customer: { serialize: 'records', deserialize: 'records' }
  },

  primaryKey: 'OrderID'
});
