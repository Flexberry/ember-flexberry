import ApplicationSerializer from './application';

export default ApplicationSerializer.extend({
  attrs: {
    departament: { serialize: 'odata-id', deserialize: 'records' }
  },

  /**
    Property name in which object identifier is kept.
   */
  primaryKey: '__PrimaryKey'
});
