/**
 * @module ember-flexberry
 */

import Ember from 'ember';
import BaseComponent from './flexberry-base-component';

/**
 * @class FlexberryObjectListView
 * @extends FlexberryBaseComponent
 */
export default BaseComponent.extend({
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
  selectedRecord: null,
  selectedRecords: null,
  customColumnAttributes: null,

  headerCellComponent: 'object-list-view-header-cell',
  cellComponent: 'object-list-view-cell',

  action: 'rowClick',
  addColumnToSorting: 'addColumnToSorting',
  sortByColumn: 'sortByColumn',
  rowClickable: true,
  headerClickable: true,
  showCheckBoxInRow: false,
  showDeleteButtonInRow: false,
  store: null,
  dataTable: null,

  /**
   * Service that triggers groupedit events.
   *
   * @property groupEditEventsService
   * @type GroupEditEvents
   */
  groupEditEventsService: Ember.inject.service('groupedit-events'),

  contentWithKeys: null,

  init() {
    this._super(...arguments);
    this.set('store', this.get('targetObject.store'));
    this.set('selectedRecords', Ember.A());
    this.get('groupEditEventsService').on('groupEditAddRow', this, this._addRow);
    this.get('groupEditEventsService').on('groupEditDeleteRows', this, this._deleteRows);
    this.set('contentWithKeys', Ember.A());
    var _this = this;
    if (this.content) {
      this.get('content').forEach(function(item, index, enumerable) {
        _this._addModel(item);
      });
    }
  },

  actions: {
    rowClick: function(key, record) {
      if (this.rowClickable) {
        this.set('selectedRecord', record);
        this._setActiveRecord(key);
        this.sendAction('action', record);
      }
    },
    headerCellClick: function(column, event) {
      if (this.headerClickable) {
        var action = event.ctrlKey ? 'addColumnToSorting' : 'sortByColumn';
        this.sendAction(action, column);
      }
    },
    deleteRow: function(key, record) {
      if (confirm('Do you really want to delete this record?')) {
        var rowToDelete = this._getRowByKey(key);
        this._removeModelWithKey(key);
        this.dataTable.api().row(rowToDelete).remove().draw(false);
        record.deleteRecord();
        var componentName = this.get('componentName');
        this.get('groupEditEventsService').rowDeletedTrigger(componentName, record);
      }
    },
    selectRow: function(key, record) {
      var selectedRecords = this.get('selectedRecords');
      var selectedRow = this._getRowByKey(key);
      var checkBoxChecked = selectedRow.find('input[type=checkbox]').prop('checked');
      if (checkBoxChecked) {
        if (!selectedRow.hasClass('selected')) {
          selectedRow.addClass('selected');
        }

        if (selectedRecords.indexOf(record) === -1) {
          selectedRecords.pushObject(record);
        }
      }
      else {
        if (selectedRow.hasClass('selected')) {
          selectedRow.removeClass('selected');
        }

        selectedRecords.removeObject(record);
      }

      var componentName = this.get('componentName');
      this.get('groupEditEventsService').rowSelectedTrigger(componentName, record, selectedRecords.length);
    }
  },

  didInsertElement: function() {
    var table = this.$().dataTable({
      info: false,
      ordering: false,
      paging: false,
      searching: false
    });
    this.set('dataTable', table);
    if (this.rowClickable) {
      var key = this._getModelKey(this.selectedRecord);
      if (key) {
        this._setActiveRecord(key);
      }
    }
  },

  columns: Ember.computed('modelProjection', function() {
    var projection = this.get('modelProjection');
    if (!projection) {
      throw new Error('No projection was defined.');
    }

    let cols = this._generateColumns(projection.attributes);
    return cols;
  }),

  willDestroy() {
    this.get('groupEditEventsService').off('groupEditAddRow', this, this._addRow);
    this.get('groupEditEventsService').off('groupEditDeleteRows', this, this._deleteRows);
    this._super(...arguments);
  },

  _generateColumns: function(attributes, columnsBuf, relationshipPath) {
    columnsBuf = columnsBuf || [];
    relationshipPath = relationshipPath || '';

    for (let attrName in attributes) {
      let currentRelationshipPath = relationshipPath;
      if (!attributes.hasOwnProperty(attrName)) {
        continue;
      }

      let attr = attributes[attrName];
      switch (attr.kind) {
        case 'hasMany':
          break;

        case 'belongsTo':
          if (!attr.options.hidden) {
            let bindingPath = currentRelationshipPath + attrName;
            if (attr.options.displayMemberPath) {
              bindingPath += '.' + attr.options.displayMemberPath;
            } else {
              bindingPath += '.id';
            }

            let column = this._createColumn(attr, bindingPath);
            columnsBuf.push(column);
          }

          currentRelationshipPath += attrName + '.';
          this._generateColumns(attr.attributes, columnsBuf, currentRelationshipPath);
          break;

        case 'attr':
          if (attr.options.hidden) {
            break;
          }

          let bindingPath = currentRelationshipPath + attrName;
          let column = this._createColumn(attr, bindingPath);
          columnsBuf.push(column);
          break;

        default:
          throw new Error(`Unknown kind of projection attribute: ${attr.kind}`);
      }
    }

    return columnsBuf;
  },

  _getRowByKey: function(key) {
    var _this = this;
    var row = null;
    this.$('tbody tr').each(function() {
      var currentKey = _this.$(this).find('td:eq(0) div:eq(0)').text();
      if (currentKey === key) {
        row = _this.$(this);
        return false;
      }
    });
    return row;
  },

  _getModelKey: function(record) {
    var modelWithKeyItem = this.get('contentWithKeys').findBy('data', record);
    return modelWithKeyItem ? modelWithKeyItem.key : null;
  },

  _removeModelWithKey(key) {
    var itemToRemove = this.get('contentWithKeys').findBy('key', key);
    if (itemToRemove) {
      this.get('contentWithKeys').removeObject(itemToRemove);
    }
  },

  _addModel: function(record) {
    var modelWithKey = Ember.Object.create({});
    var key = Ember.guidFor(record);
    modelWithKey.set('key', key);
    modelWithKey.set('data', record);
    this.get('contentWithKeys').pushObject(modelWithKey);
  },

  _addRow: function(componentName) {
    if (componentName === this.get('componentName')) {
      if (this.get('contentWithKeys').length === 0) {
        this.$('tbody tr:eq(0)').remove();
      }

      var modelName = this.get('modelProjection').modelName;
      var modelToAdd = this.store.createRecord(modelName, {});
      this.get('content').addObject(modelToAdd);
      this._addModel(modelToAdd);
      this.get('groupEditEventsService').rowAddedTrigger(componentName, modelToAdd);
    }
  },

  _deleteRows: function(componentName) {
    if (componentName === this.get('componentName')) {
      if (confirm('Do you really want to delete selected records?')) {
        var _this = this;
        var selectedRecords = this.get('selectedRecords');
        var count = selectedRecords.length;
        this.dataTable.api().rows('.selected').remove().draw(false);
        selectedRecords.forEach(function(item, index, enumerable) {
          var key = _this._getModelKey(item);
          _this._removeModelWithKey(key);
          item.deleteRecord();
          _this.get('groupEditEventsService').rowDeletedTrigger(componentName, item);
        });
        selectedRecords.clear();
        this.get('groupEditEventsService').rowsDeletedTrigger(componentName, count);
      }
    }
  },

  _setActiveRecord: function(key) {
    this.dataTable.$('tr.selected').removeClass('selected');
    var selectedRow = this._getRowByKey(key);
    selectedRow.addClass('selected');
  },

  _createColumn: function(attr, bindingPath) {
    let cellComponent = this.get('cellComponent');
    if (typeof cellComponent === 'function') {
      cellComponent = cellComponent(attr, bindingPath);
    }

    let column = {
      header: attr.caption,
      propName: bindingPath, // TODO: rename column.propName
      cellComponent: cellComponent
    };

    let customColumnAttributesFunc = this.get('customColumnAttributes');
    if (customColumnAttributesFunc) {
      let customColAttr = customColumnAttributesFunc(attr, bindingPath);
      if (customColAttr && (typeof customColAttr === 'object')) {
        Ember.$.extend(true, column, customColAttr);
      }
    }

    let sortDef;
    let sorting = this.get('sorting');
    if (sorting && (sortDef = sorting[bindingPath])) {
      column.sorted = true;
      column.sortAscending = sortDef.sortAscending;
      column.sortNumber = sortDef.sortNumber;
    }

    return column;
  }
});
