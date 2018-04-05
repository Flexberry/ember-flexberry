import Ember from 'ember';
import EditFormController from 'ember-flexberry/controllers/edit-form';

export default EditFormController.extend({
  /**
    Message to be displayed in 'ui-message' component.

    @property infoMessage
    @type String
   */
  infoMessage: Ember.computed('i18n.locale', function() {
    var message = this.get('i18n').t('forms.components-examples.flexberry-dropdown.conditional-render-example.info-message', {
      pageTemplate: new Ember.String.htmlSafe(
        '<pre><code>' +
        '{{#if model.enumeration}}<br>' +
        '  &lt;span&gt;{{model.enumeration}}&lt;/span&gt;<br>' +
        '{{else}}<br>' +
        '  {{flexberry-dropdown<br>' +
        '    items=(flexberry-enum "components-examples/flexberry-dropdown/conditional-render-example/enumeration")<br>' +
        '    value=model.enumeration<br>' +
        '  }}<br>' +
        '{{/if}}' +
        '</code></pre>')
    });

    return new Ember.String.htmlSafe(message);
  })
});
