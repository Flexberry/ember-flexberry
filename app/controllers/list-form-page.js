import Ember from 'ember';
import PaginatedControllerMixin from 'prototype-ember-cli-application/mixins/paginated-controller';
import SortableControllerMixin from 'prototype-ember-cli-application/mixins/sortable-controller';
import SortableColumnMixin from 'prototype-ember-cli-application/mixins/sortable-column';
import EmberTableColumnDefinition from 'ember-table/models/column-definition';
import ListTableCellView from 'prototype-ember-cli-application/views/ember-table/list-table-cell';

// TODO: move controller to route entirely.
export default Ember.ArrayController.extend(PaginatedControllerMixin, SortableControllerMixin, {
  actions: {
    /**
     * Обработчик клика по строке таблицы.
     *
     * @param {Ember.Object} record Объект данных, соответствующий строке.
     */
    rowClick: function(record) {
      this.transitionToRoute(record.constructor.modelName, record.get('id'));
    }
  },

  /*
  * function to create EmberTableColumnDefinition object
  */
  createColumnDefinition: function(params) {
    return EmberTableColumnDefinition.createWithMixins(SortableColumnMixin, params);
  },

  /**
   * Описание колонок для компонента ember-table. Формируется на основе представления.
   */
  tableColumns: Ember.computed('computedSorting', function() {
    var projection = this.get('modelProjection');
    if (!projection) {
      // Now projection should be defined in controller.
      // E.g. it could be init from route's setupController hook
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
   * Контент для отображения в таблице ember-table. Соответствует модели.
   */
  tableContent: Ember.computed('model', function() {
    return this.get('model');
  })
});
