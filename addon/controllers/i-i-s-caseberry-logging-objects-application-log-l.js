import ListFormController from './list-form';

/**
  Application log list form controller.

  @class IISCaseberryLoggingObjectsApplicationLogLController
  @extends ListFormController
*/
export default ListFormController.extend({
  /**
    Name of related edit form route.

    @property editFormRoute
    @type String
    @default 'i-i-s-caseberry-logging-objects-application-log-e'
  */
  editFormRoute: 'i-i-s-caseberry-logging-objects-application-log-e',

  /**
    Method to get type and attributes of a component,
    which will be embeded in object-list-view cell.

    @method getCellComponent.
    @param {Object} attr Attribute of projection property related to current table cell.
    @param {String} bindingPath Path to model property related to current table cell.
    @param {Object} modelClass Model class of data record related to current table row.
    @return {Object} Object containing name & properties of component, which will be used to render current table cell.
    { componentName: 'my-component',  componentProperties: { ... } }.
  */
  /* eslint-disable no-unused-vars */
  getCellComponent: function(attr, bindingPath, modelClass) {
    let cellComponent = this._super(...arguments);
    cellComponent.componentProperties = {
      dateFormat: 'DD.MM.YYYY, hh:mm:ss'
    };

    return cellComponent;
  }
  /* eslint-enable no-unused-vars */
});
