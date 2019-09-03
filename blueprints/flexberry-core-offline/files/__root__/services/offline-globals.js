import OfflineGlobals from 'ember-flexberry';
import Ember from 'ember';

export default OfflineGlobals.extend({
  getOfflineSchema() {
    let parentSchema= this._super(...arguments);
    let returnedSchema = Ember.merge(parentSchema, {});

    return returnedSchema;
  }
});