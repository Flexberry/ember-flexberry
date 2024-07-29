import ApplicationSerializer from './application';

// TODO: ODataSerializer.extend
export default ApplicationSerializer.extend({
  attrs: {
    togglerExampleMaster: { serialize: 'odata-id', deserialize: 'records' }
  },

  serialize() {
    let data = this._super(...arguments);
    return data;
  },

  /**
    Property name in which object identifier is kept.
   */
  primaryKey: '__PrimaryKey',
});
