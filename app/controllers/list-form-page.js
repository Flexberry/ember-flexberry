import Ember from 'ember';
import PaginatedControllerMixin from 'prototype-ember-cli-application/mixins/paginated-controller';
import SortableControllerMixin from 'prototype-ember-cli-application/mixins/sortable-controller';
import SortableColumnMixin from 'prototype-ember-cli-application/mixins/sortable-column';
import EmberTableColumnDefinition from '../column-definition';
import ListTableCellView from 'prototype-ember-cli-application/views/ember-table/list-table-cell';
import IdProxy from '../utils/idproxy';

export default Ember.ArrayController.extend(PaginatedControllerMixin, SortableControllerMixin, {

  tratra: 'OMG',

  actions: {
    /**
     * Обработчик клика по строке таблицы.
     *
     * @param {Ember.Object} record Объект данных, соответствующий строке.
     */
    rowClick: function (record) {
      this.transitionToRoute(record.constructor.typeKey, record.get('primaryKey'));
    }
  },

  /**
   * Описание колонок для компонента ember-table. Формируется на основе представления.
   */
  // FIXME: сейчас представление берется из первого объекта в модели.
  //        Его там может и не быть, если список пуст.
  //        Нужно брать представление со списковой формы (child controller or route?), наверное.
  tableColumns: Ember.computed('computedSorting', function() {
    var model = this.get('model'),
        sorting = this.get('computedSorting');
    if (model.length === 0) {
      return {};
    } else {
      var firstObject = model.objectAt(0);
      var projection = IdProxy.retrieve(firstObject.get('id'), firstObject.constructor).projection;
      return projection.get('properties').map(function (propName) {
        var columnDefinition = EmberTableColumnDefinition.createWithMixins(SortableColumnMixin, {
          columnWidth: 150,
          textAlign: 'text-align-center',
          headerCellName: propName,
          tableCellViewClass: ListTableCellView,
          getCellContent: function (row) {
            return row.content.get(propName);
          }
        });

        var sortDef = sorting[propName];
        if (sortDef) {
          columnDefinition.set('sorted', true);
          columnDefinition.set('sortAscending', sortDef.sortAscending);
          columnDefinition.set('sortNumber', sortDef.sortNumber);
        }

        return columnDefinition;
      });
    }
  }),

  /**
   * Контент для отображения в таблице ember-table. Соответствует модели.
   */
  tableContent: Ember.computed('model', function() {
    return this.get('model');
  })
});
