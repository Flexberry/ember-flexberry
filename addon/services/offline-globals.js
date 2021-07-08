import { merge } from '@ember/polyfills';
import OfflineGlobals from 'ember-flexberry-data/services/offline-globals';

export default OfflineGlobals.extend({
  /**
    Get offline schema.

    @method getOfflineSchema

    @return {Object} Returns offline schema.
  */
  getOfflineSchema() {
    let dataOfflineSchema = this._super(...arguments);
    let offlineSchema = {
      'flexberry-adv-limit': 'id,user,module,name,value',
      'i-i-s-caseberry-logging-objects-application-log': 'id,category,eventId,priority,severity,title,timestamp,machineName,appDomainName,processId,' +
        'processName,threadName,win32ThreadId,message,formattedMessage',
      'new-platform-flexberry-flexberry-user-setting': 'id,appName,userName,moduleName,settName,settLastAccessTime,txtVal',
      'new-platform-flexberry-services-lock': 'id,lockKey,userName,lockDate'
    };

    return merge(dataOfflineSchema, offlineSchema);
  },
});
