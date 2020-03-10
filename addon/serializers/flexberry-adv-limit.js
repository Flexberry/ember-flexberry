/**
  @module ember-flexberry
*/
import { Serializer } from 'ember-flexberry-data';

/**
  Serializer for {{#crossLink "FlexberryAdvLimitModel"}}model{{/crossLink}}

  @class FlexberryAdvLimitSerializer
  @extends Serializer.Odata
*/
export default Serializer.Odata.extend({
  attrs: { },

  primaryKey: '__PrimaryKey'
});
