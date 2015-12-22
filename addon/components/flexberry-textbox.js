import BaseComponent from './flexberry-base';

// Textbox component for Semantic UI.
export default BaseComponent.extend({
  // String with input css classes.
  classes: undefined,

  // Flag to make control required.
  required: false,

  // Type of input element for render.
  type: 'text',

  // Input value.
  value: undefined
});
