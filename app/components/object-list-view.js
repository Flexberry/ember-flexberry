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

    let cols = this._generateColumns(projection.attributes);
    return cols;
  }),

  _generateColumns: function(attributes, columnsBuf, relationshipPath) {
    columnsBuf = columnsBuf || [];
    relationshipPath = relationshipPath || '';

    for (let attrName in attributes) {
      if (!attributes.hasOwnProperty(attrName)) {
        continue;
      }

      let attr = attributes[attrName];

      if (attr.kind === 'belongsTo' || attr.kind === 'hasMany') {
        relationshipPath += attrName + '.';
        this._generateColumns(attr.attributes, columnsBuf, relationshipPath);
        continue;
      }

      if (attr.kind === 'attr' && !attr.options.hidden) {
        var def = {
          header: attr.caption,
          propName: relationshipPath + attrName,
          cellComponent: 'object-list-view-cell'
        };

        var sortDef;
        var sorting = this.get('sorting');
        if (sorting && (sortDef = sorting[attrName])) {
          def.sorted = true;
          def.sortAscending = sortDef.sortAscending;
          def.sortNumber = sortDef.sortNumber;
        }

        columnsBuf.push(def);
      }
    }

    return columnsBuf;
  }
});
