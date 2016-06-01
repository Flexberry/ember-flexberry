import EditFormController from 'ember-flexberry/controllers/edit-form';

export default EditFormController.extend({
  /**
   * Page title.
   *
   * @property title
   * @type String
   * @default 'Application user'
   */
  title: 'Application user',

  /**
  * Route name for transition after close edit form.
  *
  * @property parentRoute
  * @type String
  * @default 'ember-flexberry-dummy-application-user-list'
  */
  parentRoute: 'ember-flexberry-dummy-application-user-list'
});
