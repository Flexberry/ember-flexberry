import BaseEditFormController from 'ember-flexberry/controllers/edit-form';
import EditFormControllerOperationsIndicationMixin from 'ember-flexberry/mixins/edit-form-controller-operations-indication';
import MultiListController from 'ember-flexberry/mixins/multi-list-controller';

export default BaseEditFormController.extend(EditFormControllerOperationsIndicationMixin, MultiListController, {
  /**
   Route name for transition after close edit form.

   @property parentRoute
   @type String
   @default 'ember-flexberry-dummy-application-user-list'
  */
  parentRoute: 'ember-flexberry-dummy-application-user-list'
});
