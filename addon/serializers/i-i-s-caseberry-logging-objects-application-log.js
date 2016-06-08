/**
  @module ember-flexberry
 */

import ApplicationSerializer from './application';

/**
  Serializer for settings of {{#crossLink "IISCaseberryLoggingObjectsApplicationLog"}}IISCaseberryLoggingObjectsApplicationLog{{/crossLink}} model.

  TODO: ODataSerializer.extend

  @class IISCaseberryLoggingObjectsApplicationLogSerializer
 */
export default ApplicationSerializer.extend({
  /**
    The primaryKey is used when serializing and deserializing data.
    [More info](http://emberjs.com/api/data/classes/DS.RESTSerializer.html#property_primaryKey).

    @property primaryKey
    @type String
    @default '__PrimaryKey'
   */
  primaryKey: '__PrimaryKey',
});
