import EditFormNewRoute from 'ember-flexberry/routes/edit-form-new';
import EditFormRouteOperationsIndicationMixin from '../../mixins/edit-form-route-operations-indication';

export default EditFormNewRoute.extend(EditFormRouteOperationsIndicationMixin, {
  /**
    Name of model projection to be used as record's properties limitation.

    @property modelProjection
    @type String
    @default 'TestPolyChildEdit'
  */
  modelProjection: 'TestPolyChildEdit',

  /**
    Name of model to be used as form's record type.

    @property modelName
    @type String
    @default 'ember-flexberry-dummy-test-poly-child'
  */
  modelName: 'integration-examples/polymorphic-example/ember-flexberry-dummy-test-poly-child',

  /**
    Name of template to be rendered.

    @property templateName
    @type String
    @default 'ember-flexberry-dummy-test-poly-child-edit'
  */
  templateName: 'integration-examples/polymorphic-example/ember-flexberry-dummy-test-poly-child-edit',
});
