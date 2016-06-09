import ApplicationSerializer from './application';

// TODO: ODataSerializer.extend
export default ApplicationSerializer.extend({
  attrs: {
    parent: { serialize: 'odata-id', deserialize: 'records' },
    localizedTypes: { serialize: false, deserialize: 'records' }
  },

  /**
    Property name in which object identifier is kept.
   */
  primaryKey: '__PrimaryKey'
});
