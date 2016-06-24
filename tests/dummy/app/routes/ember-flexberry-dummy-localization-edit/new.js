import EditFormNewRoute from 'ember-flexberry/routes/edit-form-new';
import EditFormRouteOperationsIndicationMixin from '../../mixins/edit-form-route-operations-indication';

export default EditFormNewRoute.extend(EditFormRouteOperationsIndicationMixin, {
  /**
    Name of model projection to be used as record's properties limitation.

    @property modelProjection
    @type String
    @default 'LocalizationE'
   */
  modelProjection: 'LocalizationE',

  /**
    Name of model to be used as form's record type.

    @property modelName
    @type String
    @default 'ember-flexberry-dummy-localization'
   */
  modelName: 'ember-flexberry-dummy-localization',

  /**
    Name of controller to be used.

    @property controllerName
    @type String
    @default 'ember-flexberry-dummy-localization-edit'
   */
  controllerName: 'ember-flexberry-dummy-localization-edit',

  /**
    Name of template to be rendered.

    @property templateName
    @type String
    @default 'ember-flexberry-dummy-localization-edit'
   */
  templateName: 'ember-flexberry-dummy-localization-edit'
});
