/**
  @module ember-flexberry
*/
import ODataSerializer from 'ember-flexberry-data/serializers/odata';

/**
  Serializer for {{#crossLink "NewPlatformFlexberryFlexberryUserSettingModel"}}model{{/crossLink}}
  working with user settings.

  @class NewPlatformFlexberryFlexberryUserSettingSerializer
  @extends ODataSerializer
*/
export default ODataSerializer.extend({
  attrs: { },

  primaryKey: '__PrimaryKey'
});
