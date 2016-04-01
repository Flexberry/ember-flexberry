import Ember from 'ember';
import EditFormController from './edit-form';

export default EditFormController.extend({
  readonly: Ember.computed('parentController.readonly', function() {
    return this.get('parentController.readonly');
  }),
  transitionToParentRoute: function() {
    this.send('transitionToParentRoute');
  }
});
