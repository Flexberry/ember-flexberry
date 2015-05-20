import EmberTableCell from '../../views/table-cell';

/**
 * Представление для ячейки списковой таблицы. Вызывает обработчик клика по строке у контроллера
 * списковой формы.
 */
export default EmberTableCell.extend({
  /**
   * Обработчик клика по ячейке.
   *
   * @param {jQuery.Event} event Объект события.
   */
  click: function(event) {
    this.get('controller.targetObject')
      .send('rowClick', this.get('row.content'));
  }
});
