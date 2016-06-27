/**
 * @module ember-flexberry
 */
import ODataSerializer from 'ember-flexberry-data/serializers/odata';

export default ODataSerializer.extend({
  attrs: {
  },
  /**
  * Field name where object identifier is kept.
  */
  primaryKey: '__PrimaryKey'
});
