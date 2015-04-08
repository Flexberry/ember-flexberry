import Ember from 'ember';
import SortableHeaderCellView from 'app/views/ember-table/sortable-header-cell.js';

// TODO: move to ember-table/ folder?
export default Ember.Mixin.create({
    sorted: false,
    sortNumber: -1, // 1-based
    sortAscending: true,
    headerCellViewClass: SortableHeaderCellView
});
