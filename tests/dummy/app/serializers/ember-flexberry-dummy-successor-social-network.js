import ApplicationSerializer from './application';

// TODO: ODataSerializer.extend
export default ApplicationSerializer.extend({
  attrs: {
  },

  /**
    Property name in which object identifier is kept.
   */
  primaryKey: '__PrimaryKey'
});
