import StorageObject from 'ember-local-storage/local/object';

export default StorageObject.extend({
  storageKey: 'ember-flexberry-settings',
  initialContent: {
    perPage: 5
  }
});
