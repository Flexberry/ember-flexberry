import Controller from '@ember/controller';
import { set } from '@ember/object';

export default Controller.extend({

  actions: {
    setIndeterminate() {
      set(this, 'model.flag', null);
    }
  }
});
