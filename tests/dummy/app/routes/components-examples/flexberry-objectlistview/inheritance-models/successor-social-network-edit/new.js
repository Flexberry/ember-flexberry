import EditFormNewRoute from 'ember-flexberry/routes/edit-form-new';
import EditFormRouteOperationsIndicationMixin from '../../../../../mixins/edit-form-route-operations-indication';

export default EditFormNewRoute.extend(EditFormRouteOperationsIndicationMixin, {
  /**
    Name of model projection to be used as record's properties limitation.

    @property modelProjection
    @type String
    @default 'SuccessorE'
  */
  modelProjection: 'SuccessorE',

  /**
    Name of model to be used as form's record type.

    @property modelName
    @type String
    @default 'ember-flexberry-dummy-successor-phone'
  */
  modelName: 'ember-flexberry-dummy-successor-phone',

  /**
    Name of template to be rendered.

    @property templateName
    @type String
    @default 'ember-flexberry-dummy-application-user-edit'
  */
  templateName: 'components-examples/flexberry-objectlistview/inheritance-models/successor-social-network-edit'
});
