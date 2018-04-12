import StoreMixin from 'ember-flexberry-data/mixins/store';
import BaseStore from 'ember-flexberry-data/stores/base-store';
import config from '../config/environment';

export default BaseStore.reopen(StoreMixin, {
  init() {
    this.set('offlineSchema', {
      [config.APP.offline.dbName]: {
        // Paste your offline scheme here.
      }
    });
    return this._super(...arguments);
  }
});
