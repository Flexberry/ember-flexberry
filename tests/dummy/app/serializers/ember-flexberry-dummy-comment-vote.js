import ApplicationSerializer from './application';

// TODO: ODataSerializer.extend
export default ApplicationSerializer.extend({
  attrs: {
    applicationUser: { serialize: 'odata-id', deserialize: 'records' },
    comment: { serialize: 'odata-id', deserialize: 'records' }
  },

  /**
    Property name in which object identifier is kept.
   */
  primaryKey: '__PrimaryKey'
});
