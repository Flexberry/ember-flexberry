import BaseEditFormController from 'ember-flexberry/controllers/edit-form';
import EditFormControllerOperationsIndicationMixin from 'ember-flexberry/mixins/edit-form-controller-operations-indication';

export default BaseEditFormController.extend(EditFormControllerOperationsIndicationMixin, {
  /**
   Route name for transition after close edit form.

   @property parentRoute
   @type String
   @default 'components-examples/flexberry-objectlistview/inheritance-models/base-list'
  */
  parentRoute: 'components-examples/flexberry-objectlistview/inheritance-models/parent-list'
});
