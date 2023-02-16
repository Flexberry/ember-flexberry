import Ember from 'ember';
import EditFormController from 'ember-flexberry/controllers/edit-form';

export default EditFormController.extend({
  /**
    Flag: indicates whether 'flexberry-groupedit' component is in 'readonly' mode or not.
   
    @property readonly
    @type Boolean
   */
  readonly: false,

  baseVoteModel: null,

  init() {
    this._super(...arguments);

    var store = this.get('store');

    this.set('baseVoteModel', store.createRecord('ember-flexberry-dummy-vote'));
  },

  actions: {
    addMultipleValue(authorValue) {
      if (Ember.isNone(this.get('model.userVotes')
        .filterBy('isDeleted', false)
        .findBy('author.id', authorValue.get('id')))) {
        this.get('model.userVotes').addObject(
          this.get('store').createRecord('ember-flexberry-dummy-vote', {
            author: authorValue
          })
        );
      }
    },

    deleteMultipleValue(voteRecord) {
      voteRecord.deleteRecord();
    },

    previewMultipleValue(voteRecord) {
      window.open(this.get('target').generate('ember-flexberry-dummy-application-user-edit', voteRecord.get('author.id'), { queryParams: { readonly: true } }));
    }
  },
});
