import EditFormController from 'ember-flexberry/controllers/edit-form';

export default EditFormController.extend({
  // Caption of this particular edit form.
  title: 'Suggestion type',

  /**
  * Route name for transition after close edit form.
  *
  * @property parentRoute
  * @type String
  * @default 'ember-flexberry-dummy-suggestion-type-list'
  */
  parentRoute: 'ember-flexberry-dummy-suggestion-type-list'
});
