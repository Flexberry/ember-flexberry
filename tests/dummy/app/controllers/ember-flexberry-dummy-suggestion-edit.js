import BaseEditFormController from 'ember-flexberry/controllers/edit-form';
import EditFormControllerOperationsIndicationMixin from '../mixins/edit-form-controller-operations-indication';

export default BaseEditFormController.extend(EditFormControllerOperationsIndicationMixin, {
  /**
    Route name for transition after close edit form.

    @property parentRoute
    @type String
    @default 'ember-flexberry-dummy-suggestion-list'
   */
  parentRoute: 'ember-flexberry-dummy-suggestion-list',

  /**
    Name of model.comments edit route.

    @property commentsEditRoute
    @type String
    @default 'ember-flexberry-dummy-comment-edit'
   */
  commentsEditRoute: 'ember-flexberry-dummy-comment-edit',

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
  getCellComponent: function(attr, bindingPath, model) {
    var cellComponent = this._super(...arguments);

    if (attr.kind === 'belongsTo') {
      if (model.modelName === 'ember-flexberry-dummy-comment' && bindingPath === 'author') {
        cellComponent.componentProperties = {
          projection: 'ApplicationUserL',
          displayAttributeName: 'name',
          title: 'Author',
          relationName: 'author',
          choose: 'showLookupDialog',
          remove: 'removeLookupValue'
        };
      } else if (model.modelName === 'ember-flexberry-dummy-vote' && bindingPath === 'applicationUser') {
        cellComponent.componentProperties = {
          projection: 'ApplicationUserL',
          displayAttributeName: 'name',
          title: 'Application user',
          relationName: 'applicationUser',
          choose: 'showLookupDialog',
          remove: 'removeLookupValue'
        };
      }
    }

    return cellComponent;
  },

  actions: {
    configurateRow(rowConfig, record) {
      rowConfig.customClass += 'positive';
    }
  }
});
