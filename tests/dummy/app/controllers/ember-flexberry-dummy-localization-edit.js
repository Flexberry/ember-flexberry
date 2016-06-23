import BaseEditFormController from 'ember-flexberry/controllers/edit-form';
import EditFormMixin from '../mixins/base-edit-form-mixin';

export default BaseEditFormController.extend(EditFormMixin, {
  /**
    Route name for transition after close edit form.

    @property parentRoute
    @type String
    @default 'ember-flexberry-dummy-localization-list'
  */
  parentRoute: 'ember-flexberry-dummy-localization-list'
});
