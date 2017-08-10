import Ember from 'ember';

export let Serializer = Ember.Mixin.create({
  getAttrs: function () {
    let parentAttrs = this._super();
    let attrs = {
      author: { serialize: 'odata-id', deserialize: 'records' },
      type: { serialize: 'odata-id', deserialize: 'records' },
      editor1: { serialize: 'odata-id', deserialize: 'records' },
      userVotes: { serialize: false, deserialize: 'records' },
      files: { serialize: false, deserialize: 'records' },
      comments: { serialize: false, deserialize: 'records' }
    };

    return Ember.$.extend(true, {}, parentAttrs, attrs);
  },
  init: function () {
    this.set('attrs', this.getAttrs());
    this._super(...arguments);
  }
});
