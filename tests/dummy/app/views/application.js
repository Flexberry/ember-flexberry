import Ember from 'ember';

/**
  Override wrapper tag name to disable wrapper.

  The sidebar, as per Semantic-UI's documentation,
  need to be directly below the body element.
 */
export default Ember.Component.extend({
  tagName: ''
});
