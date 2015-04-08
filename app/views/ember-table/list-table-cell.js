import Ember from 'ember';

/**
 * Представление для ячейки списковой таблицы. Вызывает обработчик клика по строке у контроллера
 * списковой формы.
 */
export default Ember.Table.TableCell.extend({
    /**
     * Обработчик клика по ячейке.
     *
     * @param {jQuery.Event} event Объект события.
     */
    click: function(event) {
        this.get('controller.targetObject').send('rowClick', this.get('row.content'));
    }
});
