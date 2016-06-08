import ApplicationSerializer from './application';

// TODO: ODataSerializer.extend
export default ApplicationSerializer.extend({
  attrs: {
    localization: { serialize: 'odata-id', deserialize: 'records' },
    suggestionType: { serialize: 'odata-id', deserialize: 'records' }
  },

  /**
    Property name in which object identifier is kept.
   */
  primaryKey: '__PrimaryKey'
});
