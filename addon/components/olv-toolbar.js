/**
  @module ember-flexberry
*/

import $ from 'jquery';
import { assert } from '@ember/debug';
import { set, computed, observer } from '@ember/object';
import { oneWay } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { isNone } from '@ember/utils';
import { later } from '@ember/runloop';
import { getOwner } from '@ember/application';
import { A } from '@ember/array';
import FlexberryBaseComponent from './flexberry-base-component';
import serializeSortingParam from '../utils/serialize-sorting-param';
import ColsconfigMenuItems from '../mixins/colsconfig-menu-items';

/**
  @class OlvToolbar
  @extends FlexberryBaseComponent
*/
export default FlexberryBaseComponent.extend(ColsconfigMenuItems, {
  /**
    Controller for model.

    @property modelController
    @type Object
  */
  modelController: null,

  /**
    Route for edit form by click row.

    @property editFormRoute
    @type String
  */
  editFormRoute: undefined,

  /**
    Service that triggers objectlistview events.

    @property objectlistviewEventsService
    @type Service
  */
  objectlistviewEventsService: service('objectlistview-events'),

  /**
    Service for managing advLimits for lists.

    @property advLimit
    @type AdvLimitService
  */
  advLimit: service(),

  /**
    Flag to use creation button at toolbar.

    @property createNewButton
    @type Boolean
    @default false
  */
  createNewButton: false,

  /**
    Flag to specify whether the create button is enabled.

    @property enableCreateNewButton
    @type Boolean
    @default true
  */
  enableCreateNewButton: true,

  /**
    Flag to use refresh button at toolbar.

    @property refreshButton
    @type Boolean
    @default false
  */
  refreshButton: false,

  /**
    Flag to use delete button at toolbar.

    @property deleteButton
    @type Boolean
    @default false
  */
  deleteButton: false,

  /**
    Flag to use colsConfigButton button at toolbar.

    @property colsConfigButton
    @type Boolean
    @default true
    @readOnly
  */
  colsConfigButton: true,

  /**
    Flag to use advLimitButton button at toolbar.

    @property advLimitButton
    @type Boolean
    @default true
    @readOnly
  */
  advLimitButton: false,

  /**
    Flag indicates whether to show exportExcelButton button at toolbar.

    @property exportExcelButton
    @type Boolean
    @default false
  */
  exportExcelButton: false,

  /**
    Flag to use filter button at toolbar.

    @property filterButton
    @type Boolean
    @default false
  */
  filterButton: false,

  /**
    Used to specify default 'filter by any match' field text.

    @property filterText
    @type String
    @default null
  */
  filterText: null,

  /**
    Indicates that the `flexberry-objectlistview` component is used for the `flexberry-lookup` component.

    @property inLookup
    @type Boolean
    @default false
  */
  inLookup: false,

  /**
    Used to link to objectListView with same componentName.

    @property componentName
    @type String
    @default ''
  */
  componentName: '',

  /**
    The name of the `flexberry-lookup` component for which the `flexberry-objectlistview` component is used.

    @property lookupComponentName
    @type String
  */
  lookupComponentName: undefined,

  /**
    The flag to specify whether the delete button is enabled.

    @property enableDeleteButton
    @type Boolean
    @default true
  */
  enableDeleteButton: true,

  /**
  The flag to specify whether the select all button is on.

    @property selectAll
    @type Boolean
    @default true
  */
  allSelect: false,

  /**
    Name of action to send out, action triggered by click on user button.

    @property customButtonAction
    @type String
    @default 'customButtonAction'
  */
  customButtonAction: 'customButtonAction',

  /**
    Array of custom buttons of special structures [{ buttonName: ..., buttonAction: ..., buttonClasses: ... }, {...}, ...].

    @example
      ```
      {
        buttonName: '...', // Button displayed name.
        buttonAction: '...', // Action that is called from controller on this button click (it has to be registered at component).
        buttonClasses: '...', // Css classes for button.
        buttonTitle: '...' // Button title.
      }
      ```

    @property customButtonsArray
    @type Array
  */
  customButtons: undefined,







  /**
    Current adv limits.

    @property namedAdvLimits
    @type Object
  */
  namedAdvLimits: undefined,






  /**
    @property advLimitItems
    @readOnly
  */
  advLimitItems: computed('i18n.locale', 'advLimit.isAdvLimitServiceEnabled', 'namedAdvLimits', function() {
    const i18n = this.get('i18n');
    const rootItem = {
      icon: 'dropdown icon',
      iconAlignment: 'right',
      title: '',
      items: A(),
      localeKey: ''
    };
    const createLimitItem = {
      icon: 'flask icon',
      iconAlignment: 'left',
      title: i18n.t('components.olv-toolbar.create-limit-title'),
      localeKey: 'components.olv-toolbar.create-limit-title'
    };
    rootItem.items.addObject(createLimitItem);

    const limitItems = this.get('namedAdvLimits');
    const menus = this.get('menus');
    const editMenus = A();
    menus.forEach(menu => {
      const menuSubitem = this._createMenuSubitems(limitItems, menu.icon + ' icon');
      if (menuSubitem.length > 0) {
        editMenus.addObject({
          icon: 'angle right icon',
          iconAlignment: 'right',
          localeKey: `components.olv-toolbar.${menu.name}-limit-title`,
          items: menuSubitem
        });
      }
    }, this);

    if (editMenus.length > 0) {
      rootItem.items.addObjects(editMenus);
    }

    const setDefaultItem = {
      icon: 'remove circle icon',
      iconAlignment: 'left',
      title: i18n.t('components.olv-toolbar.set-default-limit-title'),
      localeKey: 'components.olv-toolbar.set-default-limit-title'
    };
    rootItem.items.addObject(setDefaultItem);

    return this.get('advLimit.isAdvLimitServiceEnabled') ? A([rootItem]) : A();
  }),




  /**
    Flag shows enable-state of delete button.
    If there are selected rows button is enabled. Otherwise - not.

    @property isDeleteButtonEnabled
    @type Boolean
    @default false
  */
  isDeleteButtonEnabled: false,

  /**
    Flag used to display filters in modal.

    @property showFiltersInModal
    @type Boolean
    @default false
    @private
  */
  showFiltersInModal: false,

  /**
    Stores the text from "Filter by any match" input field.

    @property filterByAnyMatchText
    @type String
  */
  filterByAnyMatchText: oneWay('filterText'),

  /**
    Caption to be displayed in info modal dialog.
    It will be displayed only if some info occurs.

    @property _infoModalDialogCaption
    @type String
    @default ''
    @private
  */
  _infoModalDialogCaption: '',

  /**
    Content to be displayed in info modal dialog.
    It will be displayed only if some info occurs.

    @property _infoModalDialogContent
    @type String
    @default ''
    @private
  */
  _infoModalDialogContent: '',

  /**
    Selected jQuery object, containing HTML of error modal dialog.

    @property _errorModalDialog
    @type <a href="http://api.jquery.com/Types/#jQuery">JQueryObject</a>
    @default null
    @private
  */
  _infoModalDialog: null,

  /**
    The name of the component for themodal window.
    If the `flexberry-objectlistview` component is used for the `flexberry-lookup` component, we must pass the name of the `flexberry-lookup` component to the modal window.

    @private
    @property _componentNameForModalWindow
    @type String
  */
  _componentNameForModalWindow: computed('inLookup', 'componentName', 'lookupComponentName', function () {
    return this.get('inLookup') ? this.get('lookupComponentName') : this.get('componentName');
  }),

  /**
   Shows info modal dialog.

   @method showInfoModalDialog
   @param {String} infoCaption Info caption (window header caption).
   @param {String} infoContent Info content (window body content).
   @returns {String} Info content.
   */
  showInfoModalDialog(infoCaption, infoContent) {
    let infoModalDialog = this.get('_infoModalDialog');
    if (infoModalDialog && infoModalDialog.modal) {
      this.set('_infoModalDialogCaption', infoCaption);
      this.set('_infoModalDialogContent', infoContent);
      infoModalDialog.modal('show');
    }

    let oLVToolbarInfoCopyButton = infoModalDialog.find('.olv-toolbar-info-modal-dialog-copy-button');
    oLVToolbarInfoCopyButton.get(0).innerHTML = this.get('i18n').t('components.olv-toolbar.copy');
    oLVToolbarInfoCopyButton.removeClass('disabled');
    return infoContent;
  },

  actions: {
    /**
      Handles action from object-list-view when no handler for this component is defined.

      @method actions.refresh
      @public
    */
    refresh() {
      this.get('objectlistviewEventsService').refreshListTrigger(this.get('componentName'));
    },

    /**
      Handles action from object-list-view when no handler for this component is defined.

      @method actions.createNew
      @public
    */
    createNew() {
      let editFormRoute = this.get('editFormRoute');
      assert('Property editFormRoute is not defined in controller', editFormRoute);
      let modelController = this.get('modelController');
      this.get('objectlistviewEventsService').setLoadingState('loading');
      let appController = getOwner(this).lookup('controller:application');
      let thisRouteName = appController.get('currentRouteName');
      let thisRecordId = modelController.get('model.id');
      let transitionOptions = {
        queryParams: {
          parentParameters: {
            parentRoute: thisRouteName,
            parentRouteRecordId: thisRecordId
          }
        }
      };

      later((function() {
        modelController.transitionToRoute(editFormRoute + '.new', transitionOptions);
      }), 50);
    },

    /**
      Delete selected rows.

      @method actions.delete
      @public
    */
    delete() {
      let confirmDeleteRows = this.get('confirmDeleteRows');
      if (confirmDeleteRows) {
        assert('Error: confirmDeleteRows must be a function.', typeof confirmDeleteRows === 'function');
        if (!confirmDeleteRows()) {
          return;
        }
      }

      let componentName = this.get('componentName');

      if (!this.get('allSelect'))
      {
        this.get('objectlistviewEventsService').deleteRowsTrigger(componentName, true);
      } else {
        let modelName = this.get('modelController.modelProjection.modelName');

        let filterQuery = {
          predicate: this.get('currentController.filtersPredicate'),
          modelName: modelName
        };

        this.get('objectlistviewEventsService').deleteAllRowsTrigger(componentName, filterQuery);
      }
    },

    /**
      Filters the content by "Filter by any match" field value.

      @method actions.filterByAnyMatch
      @public
    */
    filterByAnyMatch() {
      let componentName = this.get('componentName');
      this.get('objectlistviewEventsService').filterByAnyMatchTrigger(componentName, this.get('filterByAnyMatchText'));
    },

    /**
      Checks if "Enter" button was pressed.
      If "Enter" button was pressed then filters the content by "Filter by any match" field value.

      @method actions.keyDownFilterAction
      @public
    */
    keyDownFilterAction(currentValue, e) {
      if (e.keyCode === 13) {
        this.send('filterByAnyMatch');
        e.preventDefault();
        return false;
      }
    },

    /**
      Remove filter from url.

      @method actions.removeFilter
      @public
    */
    removeFilter() {
      let _this = this;

      later((function() {
        _this.set('filterByAnyMatchText', null);
        let componentName = _this.get('componentName');
        _this.get('objectlistviewEventsService').filterByAnyMatchTrigger(componentName, null);
      }), 50);
    },

    /**
      Action for custom button.

      @method actions.customButtonAction
      @public
      @param {Function|String} action The action or name of action.
    */
    customButtonAction(action) {
      let actionType = typeof action;
      if (actionType === 'function') {
        action();
      } else if (actionType === 'string') {
        this.sendAction('customButtonAction', action);
      } else {
        throw new Error('Unsupported action type for custom buttons.');
      }
    },



    /**
      Action to show confis dialog.

      @method actions.showConfigDialog
      @public
    */
    showAdvLimitDialog(settingName) {
      assert('showAdvLimitDialog:: componentName is not defined in flexberry-objectlistview component', this.componentName);
      this.get('modelController').send('showAdvLimitDialog', this.get('_componentNameForModalWindow'), settingName);
    },

    /**
      Action to show filters tool.

      @method actions.showFiltersTool
      @public
    */
    showFiltersTool() {
      const showFiltersInModal = this.get('showFiltersInModal');

      if (showFiltersInModal) {
        const componentName = this.get('componentName');
        const columns = this.get('objectlistviewEventsService').getOlvFilterColumnsArray();

        this.get('modelController').send('showFiltersDialog', componentName, columns);
      } else {
        this.sendAction('toggleStateFilters');
      }
    },













    /**
      Handler click on flexberry-menu of advLimits.

      @method actions.onLimitMenuItemClick
      @public
      @param {jQuery.Event} e jQuery.Event by click on menu item
    */
    onLimitMenuItemClick(e) {
      const iTags = $(e.currentTarget).find('i');
      const namedLimitSpans = $(e.currentTarget).find('span');
      if (iTags.length <= 0 || namedLimitSpans.length <= 0) {
        return;
      }

      const className = iTags.get(0).className;
      const advLimitName = namedLimitSpans.get(0).innerText;
      const componentName = this.get('componentName');
      const advLimitService = this.get('advLimit');

      switch (className) {
        case 'flask icon':
          this.send('showAdvLimitDialog');
          break;
        case 'checkmark box icon': {
          const advLimit = this.get(`namedAdvLimits.${advLimitName}`);
          advLimitService.saveAdvLimit(advLimit, componentName).
            then(() => {
              this.send('refresh');
            });
          break;
        }
        case 'setting icon':
          this.send('showAdvLimitDialog', advLimitName);
          break;
        case 'remove icon':
          advLimitService.deleteAdvLimit(componentName, advLimitName)
          .then(() => {
            this.get('colsConfigMenu').updateNamedAdvLimitTrigger(componentName);
            alert(
              this.get('i18n').t('components.advlimit-dialog-content.limit') +
              '"' + advLimitName + '"' +
              this.get('i18n').t('components.advlimit-dialog-content.is-deleted')
            );
          });
          break;
        case 'remove circle icon':
          advLimitService.saveAdvLimit('', componentName)
          .then(() => {
            this.send('refresh');
          });
          break;
      }
    },








    /* eslint-disable no-unused-vars */
    copyJSONContent(event) {
      let infoModalDialog = this.get('_infoModalDialog');
      infoModalDialog.find('.olv-toolbar-info-modal-dialog-content textarea').select();
      let copied = document.execCommand('copy');
      let oLVToolbarInfoCopyButton = infoModalDialog.find('.olv-toolbar-info-modal-dialog-copy-button');
      oLVToolbarInfoCopyButton.get(0).innerHTML = this.get('i18n').t(copied ? 'components.olv-toolbar.copied' : 'components.olv-toolbar.ctrlc');
      oLVToolbarInfoCopyButton.addClass('disabled');
    }
    /* eslint-enable no-unused-vars */
  },

  /**
    An overridable method called when objects are instantiated.
    For more information see [init](https://emberjs.com/api/ember/release/classes/EmberObject/methods/init?anchor=init) method of [EmberObject](https://emberjs.com/api/ember/release/classes/EmberObject).
  */
  init() {
    this._super(...arguments);

    let componentName = this.get('componentName');
    if (this.get('deleteButton') === true && !componentName) {
      throw new Error('Name of flexberry-objectlictview component was not defined.');
    }

    this.get('objectlistviewEventsService').on('olvRowSelected', this, this._rowSelected);
    this.get('objectlistviewEventsService').on('olvRowsDeleted', this, this._rowsDeleted);
    this.get('objectlistviewEventsService').on('updateSelectAll', this, this._selectAll);

    this.get('colsConfigMenu').on('updateNamedAdvLimit', this, this._updateNamedAdvLimits);
  },

  didInsertElement() {
    this._super(...arguments);

    // Initialize SemanticUI modal dialog, and remember it in a component property,
    // because after call to infoModalDialog.modal its html will disappear from DOM.
    let infoModalDialog = this.$('.olv-toolbar-info-modal-dialog');
    infoModalDialog.modal('setting', 'closable', true);
    this.set('_infoModalDialog', infoModalDialog);
    let modelController = this.get('modelController');
    if (isNone(modelController)) {
      this.set('modelController', this.get('currentController'));
    }

    this._updateListNamedUserSettings(this.get('componentName'));
  },

  /**
    Override to implement teardown.
    For more information see [willDestroy](https://emberjs.com/api/ember/release/classes/Component#method_willDestroy) method of [Component](https://emberjs.com/api/ember/release/classes/Component).
  */
  willDestroy() {
    this.get('objectlistviewEventsService').off('olvRowSelected', this, this._rowSelected);
    this.get('objectlistviewEventsService').off('olvRowsDeleted', this, this._rowsDeleted);
    this.get('objectlistviewEventsService').off('updateSelectAll', this, this._selectAll);
    this.get('colsConfigMenu').off('updateNamedAdvLimit', this, this._updateNamedAdvLimits);
    this._super(...arguments);
  },

  /**
    Event handler for "row has been selected" event in objectlistview.

    @method _rowSelected
    @private

    @param {String} componentName The name of objectlistview component
    @param {DS.Model} record The model corresponding to selected row in objectlistview
    @param {Number} count Count of selected rows in objectlistview
    @param {Boolean} checked Current state of row in objectlistview (checked or not)
    @param {Object} recordWithKey The model wrapper with additional key corresponding to selected row
  */
  /* eslint-disable no-unused-vars */
  _rowSelected(componentName, record, count, checked, recordWithKey) {
    if (componentName === this.get('componentName')) {
      this.set('isDeleteButtonEnabled', count > 0 && this.get('enableDeleteButton'));
    }
  },
  /* eslint-enable no-unused-vars */

  /**
    Handler for "Olv rows deleted" event in objectlistview.

    @method _rowsDeleted

    @param {String} componentName The name of objectlistview component
    @param {Integer} count Number of deleted records
  */
  /* eslint-disable no-unused-vars */
  _rowsDeleted(componentName, count) {
    if (this.get('allSelect')) {
      this.get('objectlistviewEventsService').updateSelectAllTrigger(this.get('componentName'), false);
    }

    if (componentName === this.get('componentName')) {
      this.set('isDeleteButtonEnabled', false);
    }
  },
  /* eslint-enable no-unused-vars */









  /* eslint-enable no-unused-vars */

  /* eslint-disable no-unused-vars */
  _selectAll(componentName, selectAllParameter, skipConfugureRows) {
    if (componentName === this.get('componentName')) {
      this.set('allSelect', selectAllParameter);
      this.set('isDeleteButtonEnabled', selectAllParameter);
    }
  },
  /* eslint-enable no-unused-vars */


  /**
    Refresh current adv limits list.

    @method _updateNamedAdvLimits

    @param {String} componentName The name of objectlistview component
  */
  _updateNamedAdvLimits(componentName) {
    const advLimitService = this.get('advLimit');
    const thisComponentName = this.get('componentName');
    if (!(advLimitService.get('isAdvLimitServiceEnabled') && componentName === thisComponentName)) {
      return;
    }

    this.set('namedAdvLimits', advLimitService.getNamedAdvLimits(thisComponentName));
  },

  /**
    Creating menu subitems.

    @method _createMenuSubitems

    @param {Object} itemsNameList Object with items names as keys.
    @param {String} icon Icon class for menu items.
  */
  _createMenuSubitems(itemsNameList, icon) {
    if (isNone(itemsNameList)) {
      return A();
    }

    const itemsNames = A(Object.keys(itemsNameList)).sortBy('name');
    return itemsNames.map(name => { return { title: name, icon: icon, iconAlignment: 'left' }; });
  }
});
