/**
  @module ember-flexberry
*/

import Ember from 'ember';
import PaginatedControllerMixin from '../mixins/paginated-controller';
import SortableControllerMixin from '../mixins/sortable-controller';
import LimitedControllerMixin from '../mixins/limited-controller';
import HierarchycalControllerMixin from '../mixins/flexberry-objectlistview-hierarchical-controller';

export default Ember.Object.extend(PaginatedControllerMixin, SortableControllerMixin, LimitedControllerMixin, HierarchycalControllerMixin, {
  componentName: undefined,
  modelName: undefined,
  projectionName: undefined,
  editFormRoute: undefined,
  exportExcelProjection: undefined,

  /**
    Get or set `perPage` value.

    @property perPageValue
    @type Number
  */
  perPageValue: Ember.computed('perPage', {
    get(key) {
      let perPage = this.get('perPage');

      return perPage;
    },

    set(key, value) {
      let perPage = parseInt(value, 10);

      // Check that the current page number does not exceed the last page number.
      let currentPage = this.get('page');
      let newLastPage = this._getLastPage(perPage);
      if (currentPage > newLastPage) {
        // Changing page or perPage value reloads route automatically.
        this.setProperties({
          page: newLastPage,
          perPage: perPage
        });
      } else {
        // Changing perPage value reloads route automatically.
        this.set('perPage', perPage);
      }

      this.get('objectlistviewEvents').refreshListOnlyTrigger(this.get('componentName'));
      return perPage;
    }
  }),
});
