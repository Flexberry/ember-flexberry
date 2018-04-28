/**
  @module ember-flexberry
*/

import OdataAdapter from 'ember-flexberry-data/adapters/odata';

/**
  Adapter for {{#crossLink "NewPlatformFlexberryServicesLockModel"}}{{/crossLink}}.

  @class NewPlatformFlexberryServicesLockAdapter
  @extends OData
*/
export default OdataAdapter.extend({
  /**
    In this model, primary key type `String`.

    @property idType
    @type String
    @default 'string'
  */
  idType: 'string',
});
