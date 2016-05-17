import Ember from 'ember';

export default Ember.Mixin.create({
  queryParams: ['sort'],

  /**
   * Current opened modal window.
   *
   * @property _openedModalDialog
   * @type JQuery
   * @default undefined
   */
  _openedModalDialog: undefined,
  title: 'Настроить отображение столбцов',
  actions: {
    /**
     * Handles create modal window action.
     * It saves created window to have opportunity to close it later.
     *
     * @method createdModalDialog
     * @param {JQuery} modalDialog Created modal window.
     */
    createdModalDialog: function(modalDialog) {
      this.set('_openedModalDialog', modalDialog);
    },

    sortByColumnsConfig: function (colsConfig) {
      alert(JSON.stringify('Mixin colsConfig='+colsConfig));
      let newSorting;
      let columnsConfig=colsConfig.slice(o);  //Clone array before sorting
      columnsConfig.sort(function (a,b) {
        return a.sortPriority - b.sortPriority;
      }
      );
    }
  },

  /**
   * Close current modal window if it exists.
   *
   * @method closeModalDialog
   */
  closeModalDialog: function () {
    let openedDialog = this.get('_openedModalDialog');
    if (openedDialog) {
      openedDialog.modal('hide');
      this.set('_openedModalDialog', undefined);
    }
  },
  clear: function() {
    this.set('_openedModalDialog', undefined);
    return this;
  }

});
