import Ember from 'ember';
import EditFormController from 'ember-flexberry/controllers/edit-form';
import EditFormControllerOperationsIndicationMixin from '../../../../mixins/edit-form-controller-operations-indication';

export default EditFormController.extend(EditFormControllerOperationsIndicationMixin, {
  /**
   Route name for transition after close edit form.

   @property parentRoute
   @type String
   @default 'ember-flexberry-dummy-application-user-list'
  */
  parentRoute: 'components-examples/flexberry-objectlistview/on-edit-form',

  store: Ember.inject.service(),

  getCellComponent: null,

  /**
    Name of related to FOLV edit form route.

    @property folvEditFormRoute
    @type String
    @default 'ember-flexberry-dummy-localization-edit'
   */
  folvEditFormRoute: 'ember-flexberry-dummy-localization-edit',

  /**
    Name of FOLV model.

    @property folvModelName
    @type String
    @default 'ember-flexberry-dummy-localization'
   */
  folvModelName: 'ember-flexberry-dummy-localization',

  /**
    Name of FOLV projection.

    @property folvProjection
    @type String
    @default 'LocalizationL'
   */
  folvProjection: 'LocalizationL',
});
