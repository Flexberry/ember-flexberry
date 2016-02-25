import DS from 'ember-data';
import ApplicationSerializer from './application';

export default ApplicationSerializer.extend(DS.EmbeddedRecordsMixin, {
  attrs: {
    employee: { serialize: 'id', deserialize: 'records' },
    customer: { serialize: 'id', deserialize: 'records' }
  },

  primaryKey: 'OrderID'
});
