import BaseEditFormController from '../ember-flexberry/controllers/edit-form';
import EditFormControllerOperationsIndicationMixin from '../../mixins/edit-form-controller-operations-indication';

BaseEditFormController.extend(EditFormControllerOperationsIndicationMixin, {
  /**
   Route name for transition after close edit form.

   @property parentRoute
   @type String
   @default 'ember-flexberry-dummy-test-poly-child-list'
  */
  parentRoute: 'ember-flexberry-dummy-test-poly-child-list'
});
