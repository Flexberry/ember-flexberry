/**
  @module ember-flexberry
*/

import Ember from 'ember';

/**
  @class FlexberryObjectlistviewHierarchicalControllerMixin
*/
export default Ember.Mixin.create({
  /**
  */
  inHierarchicalMode: false,

  /**
  */
  hierarchicalAttribute: undefined,

  actions: {
    /**
    */
    switchHierarchicalMode() {
      this.toggleProperty('inHierarchicalMode');
      this.send('refreshList');
    },

    /**
    */
    saveHierarchicalAttribute(hierarchicalAttribute, refresh) {
      if (refresh) {
        let currentHierarchicalAttribute = this.get('hierarchicalAttribute');
        if (hierarchicalAttribute !== currentHierarchicalAttribute) {
          this.set('hierarchicalAttribute', hierarchicalAttribute);
          this.send('switchHierarchicalMode');
        }
      } else {
        this.set('hierarchicalAttribute', hierarchicalAttribute);
      }
    },

    /**
    */
    loadRecords(id, target, property) {
      this.send('loadRecordsById', id, target, property);
    },
  }
});
