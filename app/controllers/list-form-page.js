import Ember from 'ember';
import PaginatedControllerMixin from 'prototype-ember-cli-application/mixins/paginated-controller';
import SortableControllerMixin from 'prototype-ember-cli-application/mixins/sortable-controller';
import SortableColumnMixin from 'prototype-ember-cli-application/mixins/sortable-column';
import EmberTableColumnDefinition from 'ember-table/models/column-definition';
import ListTableCellView from 'prototype-ember-cli-application/views/ember-table/list-table-cell';

// TODO: move controller to route entirely.
export default Ember.Controller.extend(PaginatedControllerMixin, SortableControllerMixin, {
  actions: {
    /**
     * Table row click handler.
     *
     * @param {Ember.Object} record Record related to clicked table row.
     */
    rowClick: function(record) {
      this.transitionToRoute(record.constructor.modelName, record.get('id'));
    }
  },

  /**
   * Creates ember table column definition.
   * @param params Column parameters.
   * @returns {object} created definition.
   */
  createColumnDefinition: function(params) {
    return EmberTableColumnDefinition
      .extend(SortableColumnMixin)
      .create(params);
  },

  /**
   * Table columns description (forming on the basis of view for data model).
   */
  tableColumns: Ember.computed('computedSorting', function() {
    var projection = this.get('modelProjection');
    if (!projection) {
      // Now projection should be defined in controller.
      // E.g. it could be init from route's setupController hook.
      throw new Error('No projection was defined.');
    }

    var _this = this;
    var sorting = this.get('computedSorting');
    return projection.get('properties').map(function(propName) {
      var columnDefinition = _this.createColumnDefinition({
        columnWidth: 150,
        textAlign: 'text-align-center',
        headerCellName: propName,
        tableCellViewClass: ListTableCellView,
        getCellContent: function(row) {
          return row.get(propName);
        }
      });

      var sortDef;
      if (sorting && (sortDef = sorting[propName])) {
        columnDefinition.set('sorted', true);
        columnDefinition.set('sortAscending', sortDef.sortAscending);
        columnDefinition.set('sortNumber', sortDef.sortNumber);
      }

      return columnDefinition;
    });
  }),

  /**
   * Content to be displayed in ember-table (corresponds to the data model).
   */
  tableContent: Ember.computed('model', function() {
    return this.get('model');
  })
});
