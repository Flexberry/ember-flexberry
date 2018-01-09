import Ember from 'ember';
import ListFormController from 'ember-flexberry/controllers/list-form';

export default ListFormController.extend({
  actions: {
    beforeDeleteRecord(record, data) {
      let promises = Ember.A();

      return new Ember.RSVP.Promise((resolve) => {

        let timeout = 1000;
        Ember.run.later((() => {
          resolve();
          Ember.RSVP.Promise.all(promises);
        }), timeout);
      });

      return promise;
    }
  }
});
