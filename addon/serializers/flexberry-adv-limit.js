/**
  @module ember-flexberry
*/
import OdataSerializer from 'ember-flexberry-data/serializers/odata';

/**
  Serializer for {{#crossLink "FlexberryAdvLimitModel"}}model{{/crossLink}}

  @class FlexberryAdvLimitSerializer
  @extends Serializer.Odata
*/
export default OdataSerializer.extend({
  attrs: { },

  primaryKey: '__PrimaryKey'
});
