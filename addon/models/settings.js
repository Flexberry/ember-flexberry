import StorageObject from 'ember-local-storage/local/object';

export default StorageObject.extend({
  storageKey: 'prototype-ember-application-settings',
  initialContent: {
    perPage: 5
  }
});
