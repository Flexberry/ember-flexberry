import EditFormController from 'ember-flexberry/controllers/edit-form';

export default EditFormController.extend({
  /**
   * Page title.
   *
   * @property title
   * @type String
   * @default 'Localization'
   */
  title: 'Localization',

  /**
  * Route name for transition after close edit form.
  *
  * @property parentRoute
  * @type String
  * @default 'ember-flexberry-dummy-localization-list'
  */
  parentRoute: 'ember-flexberry-dummy-localization-list'
});
