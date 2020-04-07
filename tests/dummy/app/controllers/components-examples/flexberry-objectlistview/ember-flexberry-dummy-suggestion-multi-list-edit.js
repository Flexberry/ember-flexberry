import EditFormController from 'ember-flexberry/controllers/edit-form';
import MultiListController from 'ember-flexberry/mixins/multi-list-controller';
import EditFormControllerOperationsIndicationMixin from 'ember-flexberry/mixins/edit-form-controller-operations-indication';

export default EditFormController.extend(MultiListController, EditFormControllerOperationsIndicationMixin, {
  /**
    Route name for transition after close edit form.

    @property parentRoute
    @type String
    @default 'ember-flexberry-dummy-multi-list'
   */
  parentRoute: 'ember-flexberry-dummy-multi-list',

  /**
    Name of model.comments edit route.

    @property commentsEditRoute
    @type String
    @default 'ember-flexberry-dummy-comment-edit'
   */
  commentsEditRoute: 'ember-flexberry-dummy-comment-edit',

  actions: {

    getLookupFolvProperties: function() {
      return {
        colsConfigButton: true
      };
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
  getCellComponent(attr, bindingPath, model) {
    let cellComponent = this._super(...arguments);
    if (model !== null) {
      if (attr.kind === 'belongsTo') {
        switch (`${model.modelName}+${bindingPath}`) {
          case 'ember-flexberry-dummy-vote+author':
            cellComponent.componentProperties = {
              choose: 'showLookupDialog',
              remove: 'removeLookupValue',
              preview: 'previewLookupValue',
              displayAttributeName: 'name',
              required: true,
              relationName: 'author',
              projection: 'ApplicationUserL',
              autocomplete: true,
              showPreviewButton: true,
              previewFormRoute: 'ember-flexberry-dummy-application-user-edit'
            };
            break;

          case 'ember-flexberry-dummy-comment+author':
            cellComponent.componentProperties = {
              choose: 'showLookupDialog',
              remove: 'removeLookupValue',
              displayAttributeName: 'name',
              required: true,
              relationName: 'author',
              projection: 'ApplicationUserL',
              autocomplete: true,
            };
            break;

        }
      } else if (attr.kind === 'attr') {
        switch (`${model.modelName}+${bindingPath}`) {
          case 'ember-flexberry-dummy-vote+author.eMail':
            cellComponent.componentProperties = {
              readonly: true,
            };
        }
      }

      if (model.modelName === 'ember-flexberry-dummy-application-user' ||
      model.modelName === 'ember-flexberry-dummy-suggestion' ||
      model.modelName === 'ember-flexberry-dummy-suggestion-type') {
        cellComponent.componentName = undefined;
      }
    }

    return cellComponent;
  }
});
