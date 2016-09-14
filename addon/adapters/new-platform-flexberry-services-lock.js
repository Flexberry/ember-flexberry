/**
  @module ember-flexberry
*/

import { Adapter } from 'ember-flexberry-data';

/**
  Adapter for {{#crossLink "NewPlatformFlexberryServicesLockModel"}}{{/crossLink}}.

  @class NewPlatformFlexberryServicesLockAdapter
  @extends OData
*/
export default Adapter.Odata.extend({
  /**
    In this model, primary key type `String`.

    @property idType
    @type String
    @default 'string'
  */
  idType: 'string',
});
