import ApplicationSerializer from './application';

// TODO: ODataSerializer.extend
export default ApplicationSerializer.extend({
  attrs: {
    togglerExampleMaster: { serialize: 'odata-id', deserialize: 'records' }
  },

  /* eslint-disable no-unused-vars */
  serialize(snapshot, options) {
    let data = this._super(...arguments);
    return data;
  },
  /* eslint-enable no-unused-vars */

  /**
    Property name in which object identifier is kept.
   */
  primaryKey: '__PrimaryKey',
});
