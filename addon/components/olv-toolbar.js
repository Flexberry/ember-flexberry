/**
 * @module ember-flexberry
 */

import Ember from 'ember';
import FlexberryBaseComponent from './flexberry-base-component';

export default FlexberryBaseComponent.extend({
  modelController: null,

  /**
   * Route for edit form by click row
   *
   * @property editFormRoute
   * @type String
   * @default undefined
   */
  editFormRoute: undefined,

  /**
   * Service that triggers objectlistview events.
   *
   * @property objectlistviewEventsService
   * @type ObjectlistviewEvents
   */
  objectlistviewEventsService: Ember.inject.service('objectlistview-events'),

  /**
   * Flag to use creation button at toolbar.
   *
   * @property createNewButton
   * @type Boolean
   * @default false
   */
  createNewButton: false,

  /**
   * The flag to specify whether the create button is enabled.
   *
   * @property createNewButton
   * @type Boolean
   * @default true
   */
  enableCreateNewButton: true,

  /**
   * Flag to use refresh button at toolbar.
   *
   * @property refreshButton
   * @type Boolean
   * @default false
   */
  refreshButton: false,

  /**
   * Flag to use delete button at toolbar.
   *
   * @property deleteButton
   * @type Boolean
   * @default false
   */
  deleteButton: false,

  /**
   * Flag to use filter button at toolbar.
   *
   * @property filterButton
   * @type Boolean
   * @default false
   */
  filterButton: false,

  /**
   * Used to specify default 'filter by any match' field text.
   *
   * @property filterText
   * @type String
   * @default null
   */
  filterText: null,

  /**
   * The flag to specify whether the delete button is enabled.
   *
   * @property deleteButton
   * @type Boolean
   * @default true
   */
  enableDeleteButton: true,

  /**
   * Name of action to send out, action triggered by click on user button.
   *
   * @property customButtonAction
   * @type String
   * @default 'customButtonAction'
   */
  customButtonAction: 'customButtonAction',

  /**
   * Handler to get custom buttons from controller.
   * It has to be closure event and return array of special structures [{ buttonName: ..., buttonAction: ..., buttonClasses: ... }, {...}, ...].
   *
   * @property customButtonsClosureEvent
   * @type Function
   * @default undefined
   */
  customButtonsClosureEvent: undefined,

  /**
   * Array of custom buttons.
   *
   * @property customButtonsArray
   * @type Array
   * @default undefined
   */
  customButtonsArray: undefined,

  init: function() {
    this._super(...arguments);

    var componentName = this.get('componentName');
    if (this.get('deleteButton') === true && !componentName) {
      throw new Error('Name of flexberry-objectlictview component was not defined.');
    }

    this.get('objectlistviewEventsService').on('olvRowSelected', this, this._rowSelected);
    this.get('objectlistviewEventsService').on('olvRowsDeleted', this, this._rowsDeleted);

    let customButton = this.get('customButtonsClosureEvent');
    if (customButton && typeof (customButton) === 'function') {
      let customButtonsResult = customButton();
      this.set('customButtonsArray', customButtonsResult);
    }
  },

  /**
   * Implementation of component's teardown.
   *
   * @method willDestroy
   */
  willDestroy() {
    this.get('objectlistviewEventsService').off('olvRowSelected', this, this._rowSelected);
    this.get('objectlistviewEventsService').off('olvRowsDeleted', this, this._rowsDeleted);
    this._super(...arguments);
  },

  actions: {
    refresh: function() {
      this.get('modelController').send('refreshList');
    },
    createNew: function() {
      let editFormRoute = this.get('editFormRoute');
      let modelController = this.get('modelController');
      modelController.transitionToRoute(editFormRoute + '.new');
    },

    /**
     * Delete selected rows.
     *
     * @method delete
     */
    delete: function() {
      var componentName = this.get('componentName');
      this.get('objectlistviewEventsService').deleteRowsTrigger(componentName, true);
    },

    /**
     * Filters the content by "Filter by any match" field value.
     *
     * @method filterByAnyMatch
     */
    filterByAnyMatch: function() {
      var componentName = this.get('componentName');
      this.get('objectlistviewEventsService').filterByAnyMatchTrigger(componentName, this.get('filterByAnyMatchText'));
    },

    customButtonAction: function(actionName) {
      this.sendAction('customButtonAction', actionName);
    },

    showColsConfig: function() {
      let setOrderScript=`
      var tr=this.parentNode.parentNode;
      var tbody=tr.parentNode;
      var value=this.options.item(this.selectedIndex).value;
      var input=$(tr).find('input').get(0);
      var inputs=$('input.priority:enabled',tbody);
      var max,priority;
      if (value=='-') {
        input.value='';
        input.disabled=true;
        input.style.display='none';
      } else {
        if (!input.disabled) return;
        input.value=inputs.length+1;
        input.prevValue=inputs.length+1;
        input.disabled=false;
        input.style.display='';
      }
`;

      let setHideUnhideScript=`
      var td=this.parentNode;
      var tr=td.parentNode;
      if (/unhide/.exec(this.className)) {
        this.className='large hide icon';
        $(this).parent().siblings('TD').addClass('disabled');
      } else {
        this.className='large unhide icon';
        $(this).parent().siblings('TD').removeClass('disabled');
      }
`;

      let setPriorityScript=`
     var newValue=parseInt(this.value);
     var prevValue=this.prevValue;
     var tr=this.parentNode.parentNode;
     var tbody=tr.parentNode;
     var input,inputValue,inputs=$('input.priority:enabled',tbody);
     if (isNaN(newValue) || newValue<=0) {
       newValue=inputs.length;
     }
     if (prevValue==newValue) return;
     this.value=newValue;
     this.prevValue=newValue;
     var from,to,delta;
     if (prevValue < newValue) {
       from=prevValue;
       to=newValue+1;
       delta= -1;
     } else {
       from=newValue-1;
       to=prevValue;
       delta=1;
     }
//      alert(from+'-'+to + ' +='+delta);
     for (var i=0;i<inputs.length;i++) {
       input=inputs.get(i);
       inputValue=parseInt(input.value);
       if (input!==this && inputValue > from && inputValue < to) {
         inputValue+=delta;
         input.value=inputValue;
         input.prevValue=inputValue;
       }
     }
`;

    let rowUpScript=`
      var newTr,tr=this.parentNode.parentNode.parentNode;
     var tbody=tr.parentNode;
     var prevTr=tr.previousSibling;
//      alert(tr.id+ ' ' + tbody.tagName + ' before=' + prevTr.id);
     if (prevTr) {
       newTr=tr.cloneNode(true);
       tbody.removeChild(tr);
       tbody.insertBefore(newTr,prevTr);
     }
//     alert('up');
     `;

    let rowDownScript=`
     var newTr,tr=this.parentNode.parentNode.parentNode;
     var tbody=tr.parentNode;
     var nextTr=tr.nextSibling;
     //      alert(tr.id+ ' ' + tbody.tagName + ' before=' + nextTr.id);
     if (nextTr) {
       newTr=tr.cloneNode(true);
       tbody.removeChild(tr);
       if (nextTr.nextSibling) {
         tbody.insertBefore(newTr,nextTr.nextSibling);
       } else {
         tbody.appendChild(newTr);
       }
     }
     //     alert('up');
     `;

     let okScript=`
     var modalDiv=$('#ColsConfig').get(0);
     modalDiv.parentNode.removeChild(modalDiv);
     `;

     let saveScript=`
     alert('save');
     `;

      let modelController = this.get('modelController');
      let projectionAttributes=modelController.modelProjection.attributes;
      var modalDiv=document.createElement('div');
      modalDiv.id="ColsConfig";
      modalDiv.className='flexberry-modal  ember-view ui modal active';
      modalDiv.style.marginTop=' -169px';
      modalDiv.style.display='block !important';
      var content='<i class="close icon"></i><div class="header">Настроить отображение столбцов</div>';
      content+=`
<div class=" content">
  <div class="description">
    <div class="list-group">
      <table class="ui selectable celled table"
        ><thead
          ><tr
          ><th style="width:24px;align:right">№</th
          ><th style="width:36px;align:center"><i class='large hide icon' title='Не отображать столбцы'></i></th
          ><th>Направление сортировки</th
          ><th>Приоритет при сортировке</th
          ><th>Название столбца</th
          ><th style="width:72px;text-align:center"><i class='large sort icon' title='Установить порядок по умолчанию'></i></th
          ></tr
        ></thead
        ><tbody
        `;
      let n=0;
      for (let prop in projectionAttributes) {
        let colName=projectionAttributes[prop].caption;
          if (projectionAttributes[prop].kind=='belongsTo') {
            colName=colName  + '@' + projectionAttributes[prop].modelName;
          }
          n++;
          content+=`
          ><tr id='colsConfigTR[`+colName+`]'
            ><td>`+n+`</td
            ><td><i class='large unhide icon' colsConfigHidden=false onClick="`+setHideUnhideScript+`"></i></td
            ><td><select name="order[`+colName+`]" onChange="`+setOrderScript+`"><option>-</option><option value='asc'>↑</option><option value='desc'>↓</option></select></td
            ><td><input class='priority' type='input' name='priority[`+colName+`]' onChange="`+setPriorityScript+`" disabled style='display:none' /></td
            ><td>`+colName+`</td
            ><td><nobr><button onClick="`+rowUpScript+`">↑</button><button onClick="`+rowDownScript+`">↓</button></nobr></td
          ></tr`;
      }
      content+=`
        ></tbody
        ><tfoot class="full-width"
          ><tr
          ><td colspan='6'
          ><div class="ui right floated button" onClick="`+okScript+`">OK</div
            ><div class="ui"
              >Название настройки <input type='input' name='configName' placeholder='Введите название настройки'
              /><div class="ui small button" onClick="`+saveScript+`">Сохранить</div
            ></div
          ></td
          ></tr
        ></tfoot
      ></table>
    </div>`;
      content+=`
  </div>
</div>`;


      modalDiv.innerHTML=content;
      this.element.appendChild(modalDiv);
    }
  },

  /**
   * Flag shows enable-state of delete button.
   * If there are selected rows button is enabled. Otherwise - not.
   *
   * @property isDeleteButtonEnabled
   * @type Boolean
   * @default false
   */
  isDeleteButtonEnabled: false,

  /**
   * Stores the text from "Filter by any match" input field.
   *
   * @property filterByAnyMatchText
   * @type String
   * @default null
   */
  filterByAnyMatchText: Ember.computed.oneWay('filterText'),

  /**
   * Event handler for "row has been selected" event in objectlistview.
   *
   * @method _rowSelected
   * @private
   *
   * @param {String} componentName The name of objectlistview component.
   * @param {Model} record The model corresponding to selected row in objectlistview.
   * @param {Integer} count Count of selected rows in objectlistview.
   */
  _rowSelected: function(componentName, record, count) {
    if (componentName === this.get('componentName')) {
      this.set('isDeleteButtonEnabled', count > 0 && this.get('enableDeleteButton'));
    }
  }
});
