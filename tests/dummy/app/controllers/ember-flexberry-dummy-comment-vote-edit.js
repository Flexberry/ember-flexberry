import DetailEditFormController from 'ember-flexberry/controllers/detail-edit-form';
import EditFormControllerOperationsIndicationMixin from 'ember-flexberry/mixins/edit-form-controller-operations-indication';

export default DetailEditFormController.extend(EditFormControllerOperationsIndicationMixin, {
  validations: {
    'model.applicationUser': { presence: true },
    'model.comment': { presence: true },
  },
});
