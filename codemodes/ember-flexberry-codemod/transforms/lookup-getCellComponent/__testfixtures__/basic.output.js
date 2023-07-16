import DetailEditFormController from 'ember-flexberry/controllers/detail-edit-form';
import EditFormControllerOperationsIndicationMixin from 'ember-flexberry/mixins/edit-form-controller-operations-indication';

export default DetailEditFormController.extend(EditFormControllerOperationsIndicationMixin, {

  commentsVoteEditRoute: 'ember-flexberry-dummy-comment-vote-edit',

  getCellComponent: function(attr, bindingPath, model) {
    let cellComponent = this._super(...arguments);

    if (attr.kind === 'belongsTo') {
      let updateLookupValue = this.get('actions.updateLookupValue').bind(this);
      if (model.modelName === 'ember-flexberry-dummy-comment-vote' && bindingPath === 'applicationUser') {
        cellComponent.componentProperties = {
          projection: 'ApplicationUserL',
          displayAttributeName: 'name',
          title: 'Application user',
          relationName: 'applicationUser',
          choose: 'showLookupDialog',
          remove: 'removeLookupValue',
          updateLookupValue: updateLookupValue
        };
      }
    }

    return cellComponent;
  }
});
