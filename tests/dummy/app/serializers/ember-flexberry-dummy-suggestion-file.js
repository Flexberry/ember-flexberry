import ApplicationSerializer from './application';

// TODO: ODataSerializer.extend
export default ApplicationSerializer.extend({
attrs: {
suggestion: { serialize: 'odata-id', deserialize: 'records' }
},
/**
  * Field name where object identifier is kept.
  */
  primaryKey: '__PrimaryKey'
});
