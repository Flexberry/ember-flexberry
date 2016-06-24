/**
 * @module ember-flexberry
 */
import ODataSerializer from 'ember-flexberry-data/serializers/odata';

/**
  Serializer .

  @class NewPlatformFlexberryFlexberryUserSettingSerializer
  @extends ODataSerializer
 */
export default ODataSerializer.extend({
  attrs: { },

  primaryKey: '__PrimaryKey'
});
