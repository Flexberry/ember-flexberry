import ApplicationSerializer from './application';

// TODO: ODataSerializer.extend
export default ApplicationSerializer.extend({
attrs: {
parent: { serialize: 'odata-id', deserialize: 'records' },
localizedTypes: { serialize: false, deserialize: 'records' }
},
/**
  * Field name where object identifier is kept.
  */
  primaryKey: '__PrimaryKey'
});
