import EditFormController from 'ember-flexberry/controllers/edit-form';

export default EditFormController.extend({
  /**
    Counter to mark created records.

    @property _itemsCounter
    @private
    @type Number
    @default 0
  */
  _itemsCounter: 0,

  /**
    Flag indicates that component have to check on model changes and display it.

    @property searchForContentChange
    @type Boolean
    @default true
  */
  searchForContentChange: true,

  actions: {
    /**
      Adds detail to the end of the array.

      @method actions.addDetail.
    */
    addDetail() {
      let store = this.get('store');
      let itemsCounter = this.get('_itemsCounter') + 1;
      let detailModel = this.get('model.details');
      let newRecord = store.createRecord('components-examples/flexberry-groupedit/settings-example/detail',
      {
        text: itemsCounter
      });

      detailModel.addObject(newRecord);
      this.set('_itemsCounter', itemsCounter);
    },

    /**
      Removes first element of the detail array.

      @method actions.deleteDetail.
    */
    deleteDetail() {
      let recordToDelete = this.get('model.details').get('firstObject');
      if (recordToDelete) {
        recordToDelete.deleteRecord();
      }
    }
  },

  /**
    Method to get type and attributes of a component,
    which will be embeded in object-list-view cell.

    @method getCellComponent.
    @param {Object} attr Attribute of projection property related to current table cell.
    @param {String} bindingPath Path to model property related to current table cell.
    @param {DS.Model} modelClass Model class of data record related to current table row.
    @return {Object} Object containing name & properties of component, which will be used to render current table cell.
    { componentName: 'my-component',  componentProperties: { ... } }.
  */
  getCellComponent(attr, bindingPath) {
    var cellComponent = this._super(...arguments);

    if (attr.kind === 'belongsTo' && bindingPath === 'master') {
      cellComponent.componentProperties = {
        projection: 'MasterL',
        displayAttributeName: 'text',
        title: 'Master',
        relationName: 'master',
        choose: 'showLookupDialog',
        remove: 'removeLookupValue'
      };
    }

    return cellComponent;
  }
});
