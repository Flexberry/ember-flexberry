import EmberTableCell from '../../views/table-cell';

export default EmberTableCell.extend({
    templateName: 'ember-table/sortable-header-cell',

    /**
     * Обработчик клика по ячейке. Вызывает различные методы контроллера в зависимости от того, была ли нажата
     * клавиша ctrl при клике.
     *
     * @param {jQuery.Event} event Объект события.
     */
    click: function(event) {
        var targetController = this.get('controller.targetObject'),
            headerCellName = this.get('content.headerCellName');
        if (event.ctrlKey) {
            targetController.send('addColumnToSorting', headerCellName);
        } else {
            targetController.send('sortByColumn', headerCellName);
        }
    }
});
