import EditFormController from 'ember-flexberry/controllers/edit-form';
import MultiListController from 'ember-flexberry/mixins/multi-list-controller';
import EditFormControllerOperationsIndicationMixin from 'ember-flexberry/mixins/edit-form-controller-operations-indication';

export default EditFormController.extend(EditFormControllerOperationsIndicationMixin, MultiListController, {
  /**
   Route name for transition after close edit form.

   @property parentRoute
   @type String
   @default 'ember-flexberry-dummy-application-user-list'
  */
  parentRoute: 'ember-flexberry-dummy-multi-list',

  getCellComponent: null,
});
