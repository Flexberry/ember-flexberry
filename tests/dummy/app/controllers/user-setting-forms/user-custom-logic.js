import Ember from 'ember';
import generateUniqueId from 'ember-flexberry-data/utils/generate-unique-id';

export default Ember.Controller.extend({
  actions: {
    batchUnchangedObjects() {
      let store = this.get('store');
      return Ember.RSVP.Promise.all([
        store.createRecord('ember-flexberry-dummy-suggestion-type', {
          name: 'type'
        }).save(),
        store.createRecord('ember-flexberry-dummy-application-user', {
          name: 'user',
          eMail: '1',
          phone1: '1'
        }).save()
      ])
      .then((createdCustomRecords) => {
        let s = store.createRecord('ember-flexberry-dummy-suggestion', {
          id: generateUniqueId(),
          text: 'suggestion',
          type: createdCustomRecords[0],
          author: createdCustomRecords[1],
          editor1: createdCustomRecords[1],
        });

        let v = store.createRecord('ember-flexberry-dummy-vote', {
          id: generateUniqueId(),
          author: createdCustomRecords[1],
          suggestion: s
        });

        s.get('userVotes').pushObject(v);

        const a = Ember.A();
        a.pushObject(s);
        a.pushObjects(s.get('userVotes').toArray());
        return store.batchUpdate(a);
      })
      .then((res) => {
        let s2 = res[0];
        let author = res[1].get('author');
        let v2 = store.createRecord('ember-flexberry-dummy-vote', {
          id: generateUniqueId(),
          author: author,
          suggestion: s2
        });

        s2.get('userVotes').pushObject(v2);

        const a2 = Ember.A();
        a2.pushObject(s2);
        a2.pushObjects(s2.get('userVotes').toArray());
        return store.batchUpdate(a2);

      })
      .then((res2) => {
        const allAreEmberObjects = Array.prototype.every.call(res2 || [], item => item instanceof Ember.Object);
        console.log(`Total array length: ${res2.length} all is ember object - ${allAreEmberObjects}`);
      });
    }
  }
});
