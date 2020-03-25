import Ember from 'ember';
import FlexberryBaseComponent from './flexberry-base-component';

/**
  Filters dialog Content component.

  @class FiltersDialogContentComponent
  @extends FlexberryBaseComponent
*/
export default FlexberryBaseComponent.extend({

  defaultPaddingStyle: Ember.computed('defaultLeftPadding', function() {
    let defaultLeftPadding = this.get('defaultLeftPadding');
    return Ember.String.htmlSafe(`padding-left:${defaultLeftPadding}px !important; padding-right:${defaultLeftPadding}px !important;`);
  }),

  /**
   Service that triggers objectlistview events.

   @property objectlistviewEvents
   @type {Class}
   @default Ember.inject.service()
   */
  objectlistviewEvents: Ember.inject.service(),

  actions: {
    /**
     Apply filters for current list.

     @method actions.applyFilters
    */    
    applyFilters() {
      this.get('objectlistviewEvents').refreshListTrigger(this.get('model.componentName'));
      this.sendAction('close');
    },

    /**
     Clear filters form.

     @method actions.clearFiltersFields
    */  
    clearFiltersFields() {
      let columns = this.get('model.columns');

      columns.forEach(column => {
        const emptyPatternValue = (Ember.typeOf(column.filter.pattern) === 'string') ? '' : undefined;
        Ember.set(column.filter, 'pattern', emptyPatternValue);
        Ember.set(column.filter, 'condition', undefined);
      });
    },
  }
});
