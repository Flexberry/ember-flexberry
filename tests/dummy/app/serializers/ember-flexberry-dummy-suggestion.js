import ApplicationSerializer from './application';

// TODO: ODataSerializer.extend
export default ApplicationSerializer.extend({
  attrs: {
  editor: { serialize: 'odata-id', deserialize: 'records' },
  type: { serialize: 'odata-id', deserialize: 'records' },
  author: { serialize: 'odata-id', deserialize: 'records' },
  files: { serialize: false, deserialize: 'records' },
  comments: { serialize: false, deserialize: 'records' },
  userVotes: { serialize: false, deserialize: 'records' }
},
  /**
  * Field name where object identifier is kept.
  */
  primaryKey: '__PrimaryKey'
});
