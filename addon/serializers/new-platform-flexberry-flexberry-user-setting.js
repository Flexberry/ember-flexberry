/**
  @module ember-flexberry
*/
import OdataSerializer from 'ember-flexberry-data/serializers/odata';

/**
  Serializer for {{#crossLink "NewPlatformFlexberryFlexberryUserSettingModel"}}model{{/crossLink}}
  working with user settings.

  @class NewPlatformFlexberryFlexberryUserSettingSerializer
  @extends ember-flexberry-data/serializers/odata
*/
export default OdataSerializer.extend({
  attrs: { },

  primaryKey: '__PrimaryKey'
});
