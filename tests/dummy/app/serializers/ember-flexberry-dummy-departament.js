import ApplicationSerializer from './application';

export default ApplicationSerializer.extend({
  attrs: {
    vid: { serialize: 'odata-id', deserialize: 'records' }
  },

  /**
    Property name in which object identifier is kept.
   */
  primaryKey: '__PrimaryKey'
});
