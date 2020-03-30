import Ember from 'ember';
import FlexberryBaseComponent from './flexberry-base-component';

/**
  Filters dialog Content component.

  @class FiltersDialogContentComponent
  @extends FlexberryBaseComponent
*/
export default FlexberryBaseComponent.extend({
  /**
   Service that triggers objectlistview events.

   @property objectlistviewEvents
   @type {Class}
   @default Ember.inject.service()
  */
  objectlistviewEvents: Ember.inject.service(),

  /**
    Filter columns without Enter key press event.

    @property _filterColumnsWithoutEnter
    @type Array
    @private
  */
  _filterColumnsWithoutEnter: Ember.A(),

  /**
    Columns with available filters.

    @property filterColumns
    @type Object[]
  */
  filterColumns: undefined,

  /**
    Unique name of the component.

    @property componentName
    @type String
  */
  componentName: undefined,

  didInsertElement: function() {
    this._super(...arguments);

    let columnsWithoutEvent = Ember.A();
    let originFilterColumns = this.get('filterColumns');

    Ember.$.extend(true, columnsWithoutEvent, originFilterColumns);

    // Disable key-down action, which was set in object-list-view.
    columnsWithoutEvent.forEach((column) => {
      if (!Ember.isNone(column.filter.component.properties.keyDown)) {
        column.filter.component.properties.keyDown = undefined;
      }
    });

    this.set('_filterColumnsWithoutEnter', columnsWithoutEvent);
  },

  actions: {
    /**
     Apply filters for current list.

     @method actions.applyFilters
    */
    applyFilters() {
      const filterColumnsOrigin = this.get('filterColumns');
      const filterColumnsWithoutEnter = this.get('_filterColumnsWithoutEnter');

      filterColumnsWithoutEnter.forEach((column) => {
        let filterColumnOrigin = filterColumnsOrigin.find(obj => obj.filter.name === column.filter.name);

        if (!Ember.isNone(filterColumnOrigin)) {
          Ember.set(filterColumnOrigin.filter, 'pattern', column.filter.pattern);
          Ember.set(filterColumnOrigin.filter, 'condition', column.filter.condition);
        }
      });

      this.set('filterColumns', filterColumnsOrigin);
      this.get('objectlistviewEvents').refreshListTrigger(this.get('componentName'));
      this.sendAction('close');
    },

    /**
     Clear filters form.

     @method actions.clearFiltersFields
    */
    clearFiltersFields() {
      const columns = this.get('_filterColumnsWithoutEnter');

      columns.forEach(column => {
        const emptyPatternValue = (typeof column.filter.pattern === 'string') ? '' : undefined;
        Ember.set(column.filter, 'pattern', emptyPatternValue);
        Ember.set(column.filter, 'condition', undefined);
      });
    },
  }
});
