import ApplicationSerializer from './application';

// TODO: ODataSerializer.extend
export default ApplicationSerializer.extend({
  attrs: {
    togglerExampleDetail: { serialize: false, deserialize: 'records' }
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
