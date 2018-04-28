/**
  @module ember-flexberry
 */

import { computed } from '@ember/object';
import ListFormRoute from 'ember-flexberry/routes/list-form';

/**
  Application log list form route.

  @class IISCaseberryLoggingObjectsApplicationLogLRoute
  @extends ListFormRoute
*/
export default ListFormRoute.extend({
  /**
    Model projection name.

    @property modelProjection
    @type String
    @default 'ApplicationLogL'
  */
  modelProjection: 'ApplicationLogL',

  /**
  developerUserSettings.
  For default userSetting use empty name ('').

  @example
    ```javascript
    {
    <componentName>: {
      <settingName>: {
          colsOrder: [ { propName :<colName>, hide: true|false }, ... ],
          sorting: [{ propName: <colName>, direction: 'asc'|'desc' }, ... ],
          colsWidths: [ <colName>:<colWidth>, ... ],
        },
        ...
      },
      ...
    }

    <componentName> may contain any of properties: colsOrder, sorting, colsWidth or being empty.
    ```

  @property developerUserSettings
  @type Object
  @default {}
  */
  developerUserSettings: computed(function() {
    return {
      IISLoggingObjectListView: `
      {
        "DEFAULT": {
          "colsOrder": [
            {
              "propName": "timestamp",
              "hide": false
            },
            {
              "propName": "category"
            },
            {
              "propName": "machineName"
            },
            {
              "propName": "appDomainName"
            },
            {
              "propName": "processId"
            },
            {
              "propName": "message"
            },
            {
              "propName": "processName",
              "hide": true
            },
            {
              "propName": "formattedMessage",
              "hide": true
            },
            {
              "propName": "eventId",
              "hide": true
            },
            {
              "propName": "priority",
              "hide": true
            },
            {
              "propName": "severity",
              "hide": true
            },
            {
              "propName": "title",
              "hide": true
            },
            {
              "propName": "threadName",
              "hide": true
            },
            {
              "propName": "win32ThreadId",
              "hide": true
            }
          ],
          "sorting": [
            {
              "propName": "timestamp",
              "direction": "desc",
              "sortPriority": 1
            }
          ]
        },
        "Message": {
          "colsOrder": [
            {
              "propName": "timestamp",
              "hide": false
            },
            {
              "propName": "category"
            },
            {
              "propName": "machineName"
            },
            {
              "propName": "appDomainName"
            },
            {
              "propName": "processId"
            },
            {
              "propName": "message"
            },
            {
              "propName": "processName",
              "hide": true
            },
            {
              "propName": "formattedMessage",
              "hide": true
            },
            {
              "propName": "eventId",
              "hide": true
            },
            {
              "propName": "priority",
              "hide": true
            },
            {
              "propName": "severity",
              "hide": true
            },
            {
              "propName": "title",
              "hide": true
            },
            {
              "propName": "threadName",
              "hide": true
            },
            {
              "propName": "win32ThreadId",
              "hide": true
            }
          ],
          "sorting": [
            {
              "propName": "timestamp",
              "direction": "desc",
              "sortPriority": 1
            }
          ]
        },
        "FormattedMessage": {
          "colsOrder": [
            {
              "propName": "timestamp",
              "hide": false
            },
            {
              "propName": "category"
            },
            {
              "propName": "machineName"
            },
            {
              "propName": "appDomainName"
            },
            {
              "propName": "processId"
            },
            {
              "propName": "formattedMessage",
              "hide": false
            },
            {
              "propName": "message",
              "hide": true
            },
            {
              "propName": "processName",
              "hide": true
            },
            {
              "propName": "eventId",
              "hide": true
            },
            {
              "propName": "priority",
              "hide": true
            },
            {
              "propName": "severity",
              "hide": true
            },
            {
              "propName": "title",
              "hide": true
            },
            {
              "propName": "threadName",
              "hide": true
            },
            {
              "propName": "win32ThreadId",
              "hide": true
            }
          ],
          "sorting": [
            {
              "propName": "timestamp",
              "direction": "desc",
              "sortPriority": 1
            }
          ]
        }
      }
      `
    }
  }),

  /**
    Model name.

    @property modelName
    @type String
    @default 'i-i-s-caseberry-logging-objects-application-log'
  */
  modelName: 'i-i-s-caseberry-logging-objects-application-log',
});
