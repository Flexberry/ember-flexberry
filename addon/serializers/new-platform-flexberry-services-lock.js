/**
  @module ember-flexberry
*/
import OdataSerializer from 'ember-flexberry-data/serializers/odata';

/**
  Serializer for {{#crossLink "NewPlatformFlexberryServicesLockModel"}}{{/crossLink}}.

  @class NewPlatformFlexberryServicesLockSerializer
  @extends ember-flexberry-data/serializers/odata
*/
export default OdataSerializer.extend({
  /**
    The `primaryKey` is used when serializing and deserializing data.
    [More info](http://emberjs.com/api/data/classes/DS.RESTSerializer.html#property_primaryKey).

    @property primaryKey
    @type String
    @default '__PrimaryKey'
  */
  primaryKey: '__PrimaryKey',
});
