import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'table',
  classNames: [
    'object-list-view',

    // Semantic UI style.
    'table',

    // DataTables styles: https://datatables.net/manual/styling/classes.
    'dataTable',
    'cell-border',
    'compact',
    'hover',
    'stripe'
  ],

  modelProjection: null,
  content: null,
  sorting: null,

  headerCellComponent: 'object-list-view-header-cell',

  action: 'rowClick',
  addColumnToSorting: 'addColumnToSorting',
  sortByColumn: 'sortByColumn',

  actions: {
    rowClick: function(record) {
      this.sendAction('action', record);
    },
    headerCellClick: function(column, event) {
      var action = event.ctrlKey ? 'addColumnToSorting' : 'sortByColumn';
      this.sendAction(action, column);
    }
  },

  _didInsertElement: function() {
    this.$().dataTable({
      info: false,
      ordering: false,
      paging: false,
      searching: false
    });
  }.on('didInsertElement'),

  columns: Ember.computed('modelProjection', function() {
    var projection = this.get('modelProjection');
    if (!projection) {
      throw new Error('No projection was defined.');
    }

    var cols = projection.get('properties').map(function(propName) {
      var def = {
        header: propName.capitalize(),
        propName: propName,
        cellComponent: 'object-list-view-cell'
      };

      var sortDef;
      var sorting = this.get('sorting');
      if (sorting && (sortDef = sorting[propName])) {
        def.sorted = true;
        def.sortAscending = sortDef.sortAscending;
        def.sortNumber = sortDef.sortNumber;
      }

      return def;
    }, this);

    return cols;
  })
});
