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

  actions: {
    /**
     Apply filters for current list.

     @method actions.applyFilters
    */
    applyFilters() {
      this.get('objectlistviewEvents').refreshListTrigger(this.get('componentName'));
      this.sendAction('close');
    },

    /**
     Clear filters form.

     @method actions.clearFiltersFields
    */
    clearFiltersFields() {
      this.get('filterColumns').forEach((column) => {
        this.send('clearFilterField', column.filter);
      });

      this.send('applyFilters');
    },

    /**
      Cleans the filter for one column.

      @method actions.clearFilterField
      @param {Object} filter Object with the filter description.
    */
    clearFilterField(filter) {
      Ember.set(filter, 'condition', 'between');
      Ember.set(filter, 'condition', undefined);
      Ember.set(filter, 'pattern', undefined);
    },

    /**
      Called when filter condition in any column was changed by user.

      @method actions.filterConditionChanged
      @param {Object} filter Object with the filter description.
      @param {String} newCondition The new value of the filter condition.
      @param {String} oldCondition The old value of the filter condition.
    */
    filterConditionChanged(filter, newCondition, oldCondition) {
      this.get('objectlistviewEvents').filterConditionChangedTrigger(this.get('componentName'), filter, newCondition, oldCondition);
    },
  }
});
