import EditFormRoute from 'ember-flexberry/routes/edit-form';
import EditFormRouteOperationsIndicationMixin from '../../mixins/edit-form-route-operations-indication';

export default EditFormRoute.extend(EditFormRouteOperationsIndicationMixin, {
  /**
    Name of model projection to be used as record's properties limitation.

    @property modelProjection
    @type String
    @default 'TestPolyEdit'
  */
  modelProjection: 'TestPolyEdit',

  /**
    Name of model to be used as form's record type.

    @property modelName
    @type String
    @default 'ember-flexberry-dummy-test-poly'
  */
  modelName: 'integration-examples/polymorphic-example/ember-flexberry-dummy-test-poly',

  /**
    Name of template to be rendered.

    @property templateName
    @type String
    @default 'ember-flexberry-dummy-test-poly-edit'
  */
  templateName: 'integration-examples/polymorphic-example/ember-flexberry-dummy-test-poly-edit',
});
