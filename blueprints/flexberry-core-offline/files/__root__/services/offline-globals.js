import OfflineGlobals from 'ember-flexberry';
import Ember from 'ember';

export default OfflineGlobals.extend({
  init() {
    this._super(...arguments);
    <% if (enableOffline) {%>this.setOnlineAvailable(false);<%}%>
  },
  getOfflineSchema() {
    let parentSchema= this._super(...arguments);
    let returnedSchema = Ember.merge(parentSchema, {
      <%= offlineSchema %>
    });

    return returnedSchema;
  }
});
