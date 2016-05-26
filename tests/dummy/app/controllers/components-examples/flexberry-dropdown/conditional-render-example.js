import Ember from 'ember';
import EditFormController from 'ember-flexberry/controllers/edit-form';

export default EditFormController.extend({
  /**
   * Page title.
   *
   * @property title
   * @type String
   * @default 'Components-examples/flexberry-dropdown/conditional-render-example'
   */
  title: 'Components-examples/flexberry-dropdown/conditional-render-example',

  /**
   * Message to be displayed in 'ui-message' component.
   *
   * @property message
   * @type String
   */
  message: new Ember.Handlebars.SafeString(
    'The page template looks like following:<br>' +
    '{{#if model.enumeration}}<br>' +
    '..&lt;span&gt;{{model.enumeration}}&lt;/span&gt;<br>' +
    '{{else}}<br>' +
    '..{{flexberry-dropdown<br>' +
    '....items=(enum-captions \"components-examples/flexberry-dropdown/conditional-render-example/enumeration\")<br>' +
    '....value=model.enumeration<br>' +
    '..}}<br>' +
    '{{/if}}<br>' +
    '<br>' +
    'So, once the value is selected, the component will be rendered as &lt;span&gt;selected value&lt;/span&gt;,<br>' +
    'after that check browser\'s console, it must be free from \"Semantic-UI\" and other errors.')
});
