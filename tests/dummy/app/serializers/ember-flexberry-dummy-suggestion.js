import ApplicationSerializer from './application';

// TODO: ODataSerializer.extend
export default ApplicationSerializer.extend({
  attrs: {
    editor1: { serialize: 'odata-id', deserialize: 'records' },
    type: { serialize: 'odata-id', deserialize: 'records' },
    author: { serialize: 'odata-id', deserialize: 'records' },
    files: { serialize: false, deserialize: 'records' },
    comments: { serialize: false, deserialize: 'records' },
    userVotes: { serialize: false, deserialize: 'records' }
  },

  serialize(snapshot, options) {
    let data = this._super(...arguments);
    delete data.СommentsCount;
    return data;
  },
  /**
    Property name in which object identifier is kept.
   */
  primaryKey: '__PrimaryKey'
});
