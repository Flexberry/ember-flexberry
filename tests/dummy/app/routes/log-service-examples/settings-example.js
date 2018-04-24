import ApllicationLogListFormRoute from 'ember-flexberry/routes/i-i-s-caseberry-logging-objects-application-log-l';
import { computed } from '@ember/object';
export default ApllicationLogListFormRoute.extend({
  /**
    Name of model projection to be used as record's properties limitation.

    @property modelProjection
    @type String
    @default 'ApplicationLogL'
  */
  modelProjection: 'ApplicationLogL',

  /**
  developerUserSettings.
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
  For default userSetting use empty name ('').
  <componentName> may contain any of properties: colsOrder, sorting, colsWidth or being empty.

  @property developerUserSettings
  @type Object
  @default {}
  */
  developerUserSettings: computed(function() {
    return { FOLVSettingExample: `
    {
      "DEFAULT": {
        "colsOrder": [
        {
          "propName": "timestamp"
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
          "propName": "timestamp"
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
          "propName": "timestamp"
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
  }}),

  /**
    Name of model to be used as list's records types.

    @property modelName
    @type String
    @default 'i-i-s-caseberry-logging-objects-application-log'
  */
  modelName: 'i-i-s-caseberry-logging-objects-application-log'
});
