/**
  @module ember-flexberry
*/

import Mixin from '@ember/object/mixin';

/**
  Mixin for [Controller](https://emberjs.com/api/ember/release/classes/Controller) to support hierarchical mode into {{#crossLink "FlexberryObjectlistviewComponent"}}{{/crossLink}}.

  @class FlexberryObjectlistviewHierarchicalControllerMixin
  @uses <a href="https://www.emberjs.com/api/ember/release/classes/Mixin">Mixin</a>
*/
export default Mixin.create({
  /**
    Flag indicate whether component is in hierarchical mode.

    @property inHierarchicalMode
    @type Boolean
    @default false
  */
  inHierarchicalMode: false,

  /**
    Flag used for disable the hierarchical paging.

    @property hierarchyPaging
    @type Boolean
    @default false
    @private
  */
  hierarchyPaging: false,

  /**
    Flag indicate whether component is in collapse/expand mode.

    @property inExpandMode
    @type Boolean
    @default false
  */
  inExpandMode: false,

  /**
    Attribute name to hierarchy build.

    @property hierarchicalAttribute
    @type Boolean
  */
  hierarchicalAttribute: undefined,

  actions: {
    /**
      Switch hierarchical mode.

      @method actions.switchHierarchicalMode
    */
    switchHierarchicalMode() {
      this.toggleProperty('inHierarchicalMode');
      this.send('refreshList');
    },

    /**
      Switch collapse/expand mode.

      @method actions.switchExpandMode
    */
    switchExpandMode() {
      this.toggleProperty('inExpandMode');
      this.send('refreshList');
    },

    /**
      Saves attribute name and switches the mode if necessary.

      @method actions.saveHierarchicalAttribute
      @param {String} hierarchicalAttribute Attribute name to hierarchy build.
      @param {Boolean} [refresh] If `true`, then switch hierarchical mode.
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
      Redirect actions into route.

      @method actions.loadRecords
      @param {String} id Record ID.
      @param {ObjectListViewRowComponent} Instance of {{#crossLink "ObjectListViewRowComponent"}}{{/crossLink}}.
      @param {String} property Property name into {{#crossLink "ObjectListViewRowComponent"}}{{/crossLink}}.
      @param {Boolean} Flag indicates that this is the first download of data.
    */
    loadRecords(id, target, property, firstRunMode) {
      this.send('loadRecordsById', id, target, property, firstRunMode);
    },
  }
});
