/**
  @module ember-flexberry
*/

import { computed } from '@ember/object';
import ListFormRoute from './list-form';

/**
  Route list form for {{#crossLink "NewPlatformFlexberryServicesLockModel"}}{{/crossLink}}.

  @class NewPlatformFlexberryServicesLockListRoute
  @extends ListFormRoute
*/
export default ListFormRoute.extend({
  /**
    @property modelName
    @type String
    @default 'new-platform-flexberry-services-lock'
  */
  modelName: 'new-platform-flexberry-services-lock',

  /**
    @property modelProjection
    @type String
    @default 'LockL'
  */
  modelProjection: 'LockL',

  /**
    @property developerUserSettings
    @type Object
    @default { DEFAULT: {} }
  */
  developerUserSettings: computed(function() {
    return {
      LockObjectListView: {
        'DEFAULT': {
          'columnWidths': [{ 'propName': 'OlvRowToolbar', 'fixed': true, 'width': 100 }]
        }
      }
    }
  }),
});
