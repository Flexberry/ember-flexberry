import ListFormController from 'ember-flexberry/controllers/list-form';

export default ListFormController.extend({
  /**
    Name of related edit form route.

    @property editFormRoute
    @type String
    @default 'components-examples/flexberry-objectlistview/downloading-files-from-olv-edit'
   */
  editFormRoute: 'components-examples/flexberry-objectlistview/downloading-files-from-olv-edit',

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
  /* eslint-disable no-unused-vars */
  getCellComponent: function(attr, bindingPath, model) {
    let cellComponent = this._super(...arguments);
    if (bindingPath === 'file') {
      cellComponent = {
        componentName: 'flexberry-file',
        componentProperties: {
          readonly: true,
          showUploadButton: false,
          showModalDialogOnUploadError: true,
          showModalDialogOnDownloadError: true,
        }
      };
    }

    return cellComponent;
  }
  /* eslint-enable no-unused-vars */
});
