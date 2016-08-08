/**
  @module ember-flexberry
*/
import { Serializer } from 'ember-flexberry-data';

/**
  Serializer for {{#crossLink "NewPlatformFlexberryFlexberryUserSettingModel"}}model{{/crossLink}}
  working with user settings.

  @class NewPlatformFlexberryFlexberryUserSettingSerializer
  @extends Serializer.Odata
*/
export default Serializer.Odata.extend({
  attrs: { },

  primaryKey: '__PrimaryKey'
});
