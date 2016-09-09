/**
  @module ember-flexberry
*/
import { Serializer } from 'ember-flexberry-data';

/**
  Serializer for {{#crossLink "NewPlatformFlexberryServicesLockModel"}}{{/crossLink}}.

  @class NewPlatformFlexberryServicesLockSerializer
  @extends Serializer.OData
*/
export default Serializer.Odata.extend({
  /**
    The `primaryKey` is used when serializing and deserializing data.
    [More info](http://emberjs.com/api/data/classes/DS.RESTSerializer.html#property_primaryKey).

    @property primaryKey
    @type String
    @default '__PrimaryKey'
  */
  primaryKey: '__PrimaryKey',
});
