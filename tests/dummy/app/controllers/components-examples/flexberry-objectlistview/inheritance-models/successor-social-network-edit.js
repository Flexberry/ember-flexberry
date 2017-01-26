import BaseEditFormController from 'ember-flexberry/controllers/edit-form';
import EditFormControllerOperationsIndicationMixin from '../../../../mixins/edit-form-controller-operations-indication';

export default BaseEditFormController.extend(EditFormControllerOperationsIndicationMixin, {
  /**
   Route name for transition after close edit form.

   @property parentRoute
   @type String
   @default 'components-examples/flexberry-objectlistview/inheritance-models/successor-social-network-list'
  */
  parentRoute: 'components-examples/flexberry-objectlistview/inheritance-models/successor-social-network-list'
});
