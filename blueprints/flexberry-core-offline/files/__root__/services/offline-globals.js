import OfflineGlobals from 'ember-flexberry/services/offline-globals';
import { merge } from '@ember/polyfills';

export default OfflineGlobals.extend({
  init() {
    this._super(...arguments);
    <% if (enableOffline) {%>this.setOnlineAvailable(false);<%}%>
  },
  getOfflineSchema() {
    let parentSchema = this._super(...arguments);
    let returnedSchema = merge(parentSchema, {
      <%= offlineSchema %>
    });

    return returnedSchema;
  }
});
