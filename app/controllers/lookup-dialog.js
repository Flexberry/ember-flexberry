import EmberTableColumnDefinition from 'ember-table/models/column-definition';
import ListFormPageController from '../controllers/list-form-page';

export default ListFormPageController.extend({
  _currentRow: undefined,

  actions: {

    // Save the currentRow on rowClicked.
    rowClick: function(record) {
      this.set('_currentRow', record);
    },

    saveLookupDialog: function() {
      var saveTo = this.get('saveTo');
      if (!saveTo) {
        throw new Error('Don\'t know where to save - no saveTo data defined.');
      }

      saveTo.model.set(saveTo.propName, this.get('_currentRow'));

      // Manually set isDirty flag, because its not working now
      // when change relation props.
      // No check for 'old' and 'new' lookup data equality, because ember
      // will do it automatically after bug fix.
      saveTo.model.send('becomeDirty');
    }
  },

  /*
   * Override a function to create EmberTableColumnDefinition object
   * without sortable-column mixin.
   */
  createColumnDefinition: function(params) {
    return EmberTableColumnDefinition.create(params);
  },

  clear: function() {
    this.set('_currentRow', undefined);
    this.set('saveTo', undefined);
    this.set('modelProjection', undefined);
    return this;
  }
});
