/**
 * @module ember-flexberry
 */

import Ember from 'ember';
import FlexberryBaseComponent from './flexberry-base-component';
import FlexberryLookupCompatibleComponentMixin from '../mixins/flexberry-lookup-compatible-component';

/**
 * @class FlexberryObjectListView
 * @extends FlexberryBaseComponent
 */
export default FlexberryBaseComponent.extend(FlexberryLookupCompatibleComponentMixin, {
  tagName: 'table',
  classNames: [
    'object-list-view',

    // Semantic UI styles.
    'ui',
    'celled',
    'table'
  ],

  /**
   * Path to component's settings in application configuration (JSON from ./config/environment.js).
   *
   * @property appConfigSettingsPath
   * @type String
   * @default 'APP.components.flexberryBaseComponent'
   */
  appConfigSettingsPath: 'APP.components.objectListView',

  modelProjection: null,
  content: null,
  sorting: null,
  selectedRecord: null,
  selectedRecords: null,
  customColumnAttributes: null,

  headerCellComponent: 'object-list-view-header-cell',
  cellComponent: {
    componentName: 'object-list-view-cell',
    componentProperties: null
  },

  action: 'rowClick',
  addColumnToSorting: 'addColumnToSorting',
  sortByColumn: 'sortByColumn',
  filterByAnyMatch: 'filterByAnyMatch',
  rowClickable: true,
  headerClickable: true,
  showCheckBoxInRow: false,
  showDeleteButtonInRow: false,
  store: Ember.inject.service(),
  noDataMessage: null,

  /**
   * Service that triggers objectlistview events.
   *
   * @property objectlistviewEventsService
   * @type Service
   */
  objectlistviewEventsService: Ember.inject.service('objectlistview-events'),

  /**
   * Flag shows if deleted records should be immediately saved to server after delete.
   *
   * @property immediateDelete
   * @type Boolean
   * @default false
   */
  immediateDelete: false,

  contentWithKeys: null,

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
        this._deleteRecord(record, this.get('immediateDelete'));
      }
    },
    selectRow: function(key, record) {
      var selectedRecords = this.get('selectedRecords');
      var selectedRow = this._getRowByKey(key);
      var checkBoxChecked = selectedRow.find('input[type=checkbox]').prop('checked');
      if (checkBoxChecked) {
        if (!selectedRow.hasClass('active')) {
          selectedRow.addClass('active');
        }

        if (selectedRecords.indexOf(record) === -1) {
          selectedRecords.pushObject(record);
        }
      } else {
        if (selectedRow.hasClass('active')) {
          selectedRow.removeClass('active');
        }

        selectedRecords.removeObject(record);
      }

      var componentName = this.get('componentName');
      this.get('objectlistviewEventsService').rowSelectedTrigger(componentName, record, selectedRecords.length);
    }
  },

  init: function() {
    this._super(...arguments);

    this.set('selectedRecords', Ember.A());
    this.get('objectlistviewEventsService').on('olvAddRow', this, this._addRow);
    this.get('objectlistviewEventsService').on('olvDeleteRows', this, this._deleteRows);
    this.get('objectlistviewEventsService').on('filterByAnyMatch', this, this._filterByAnyMatch);
    this.set('contentWithKeys', Ember.A());
    if (!this.get('noDataMessage')) {
      this.set('noDataMessage', this.get('i18n').t('object-list-view.no-data-text'));
    }

    if (this.get('rowClickable')) {
      this.get('classNames').push('selectable');
    }

    if (this.get('readonly')) {
      this.get('classNames').push('readonly');
    }

    var _this = this;
    if (this.get('content')) {
      this.get('content').forEach(function(item, index, enumerable) {
        _this._addModel(item);
      });
    }
  },

  willDestroy: function() {
    this.get('objectlistviewEventsService').off('olvAddRow', this, this._addRow);
    this.get('objectlistviewEventsService').off('olvDeleteRows', this, this._deleteRows);

    this._super(...arguments);
  },

  didInsertElement: function() {
    this._super(...arguments);

    if (!(this.get('showCheckBoxInRow') || this.get('showDeleteButtonInRow'))) {
      this.$('thead tr th:eq(1)').css('border-left', 'none');
      this.$('tbody tr').find('td:eq(1)').css('border-left', 'none');
    }

    if (this.rowClickable) {
      var key = this._getModelKey(this.selectedRecord);
      if (key) {
        this._setActiveRecord(key);
      }
    }
  },

  willDestroyElement: function() {
    this._super(...arguments);
  },

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

  _createColumn: function(attr, bindingPath) {
    // We get the 'getCellComponent' function directly from the controller,
    // and do not pass this function as a component attrubute,
    // to avoid 'Ember.Object.create no longer supports defining methods that call _super' error,
    // if controller's 'getCellComponent' method call its super method from the base controller.
    let currentController = this.get('currentController');
    let getCellComponent = Ember.get(currentController || {}, 'getCellComponent');
    let cellComponent = this.get('cellComponent');

    if (Ember.typeOf(getCellComponent) === 'function') {
      let recordModel =  (this.get('content') || {}).type || null;
      cellComponent = getCellComponent.call(currentController, attr, bindingPath, recordModel);
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
  },

  _getRowByKey: function(key) {
    var _this = this;
    var row = null;
    this.$('tbody tr').each(function() {
      var currentKey = _this.$(this).find('td:eq(0) div:eq(0)').text().trim();
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
      var modelName = this.get('modelProjection').modelName;
      var modelToAdd = this.get('store').createRecord(modelName, {});
      this.get('content').addObject(modelToAdd);
      this._addModel(modelToAdd);
      this.get('objectlistviewEventsService').rowAddedTrigger(componentName, modelToAdd);
    }
  },

  /**
   * Handler for "delete selected rows" event in objectlistview.
   *
   * @method _deleteRows
   *
   * @param {String} componentName The name of objectlistview component.
   * @param {Boolean} immediately Flag to delete record immediately.
   */
  _deleteRows: function(componentName, immediately) {
    if (componentName === this.get('componentName')) {
      if (confirm('Do you really want to delete selected records?')) {
        var _this = this;
        var selectedRecords = this.get('selectedRecords');
        var count = selectedRecords.length;
        selectedRecords.forEach(function(item, index, enumerable) {
          Ember.run.once(this, function() {
            _this._deleteRecord(item, immediately);
          });
        }, this);

        selectedRecords.clear();
        this.get('objectlistviewEventsService').rowsDeletedTrigger(componentName, count);
      }
    }
  },

  _deleteRecord: function(record, immediately) {
    var key = this._getModelKey(record);
    this._removeModelWithKey(key);
    record.deleteRecord();
    if (immediately === true) {
      record.save();
    }

    var componentName = this.get('componentName');
    this.get('objectlistviewEventsService').rowDeletedTrigger(componentName, record, immediately);
  },

  /**
   * The handler for "filter by any match" event triggered in objectlistview events service.
   *
   * @method _filterByAnyMatch
   * @private
   *
   * @param {String} pattern The pattern to filter objects.
   */
  _filterByAnyMatch: function(componentName, pattern) {
    this.sendAction('filterByAnyMatch', pattern);
  },

  _setActiveRecord: function(key) {
    var selectedRow = this._getRowByKey(key);
    this.$('tbody tr.active').removeClass('active');
    selectedRow.addClass('active');
  },

  _colCount: Ember.computed('columns.length', 'showCheckBoxInRow', 'showDeleteButtonInRow', function() {
    var numOfAdditionalColumns = (this.showCheckBoxInRow || this.showDeleteButtonInRow) ? 1 : 0;
    return this.get('columns').length + numOfAdditionalColumns;
  }),

  _detailChanged: Ember.observer('content.@each.hasDirtyAttributes', function() {
    var componentName = this.get('componentName');
    this.get('objectlistviewEventsService').rowsChangedTrigger(componentName);
  })
});
