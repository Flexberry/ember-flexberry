/**
  @module ember-flexberry
*/

import Component from '@ember/component';
import { isBlank, isNone } from '@ember/utils';
import { observer } from '@ember/object';
import { translationMacro as t } from 'ember-i18n';

/**
  Component's CSS-classes names.
  JSON-object containing string constants with CSS-classes names related to component's .hbs markup elements.

  @property {Object} flexberryClassNames
  @property {String} flexberryClassNames.prefix Component's CSS-class names prefix ('flexberry-jsonarea').
  @property {String} flexberryClassNames.wrapper Component's wrapping <div> CSS-class name ('flexberry-jsonarea').
  @property {String} flexberryClassNames.textArea Component's editable text area CSS-class name ('flexberry-jsonarea-textarea').
  @property {String} flexberryClassNames.editButon Component's edit button CSS-class name ('flexberry-jsonarea-edit-button').
  @readonly
  @static

  @for FlexberryJsonareaComponent
*/
const flexberryClassNamesPrefix = 'flexberry-jsonarea';
const flexberryClassNames = {
  prefix: flexberryClassNamesPrefix,
  wrapper: flexberryClassNamesPrefix,
  textArea: flexberryClassNamesPrefix + '-textarea',
  editButon: flexberryClassNamesPrefix + '-edit-button',
};

/**
  Flexberry json area component with.

  @class FlexberryJsonareaComponent
  @extends <a href="https://emberjs.com/api/ember/release/classes/Component">Component</a>
*/
let FlexberryJsonareaComponent = Component.extend({
  /**
    Flag: indicates whether to show error message or not.

    @property _showErrorMessage
    @type Boolean
    @default false
    @private
  */
  _showErrorMessage: false,

  /**
    Error message caption.

    @property _errorMessageCaption
    @type String
    @default t('components.flexberry-jsonarea.parse-error.caption')
    @private
  */
  _errorMessageCaption: t('components.flexberry-jsonarea.parse-error.caption'),

  /**
    Error message.

    @property _errorMessage
    @type String
    @default ''
    @private
  */
  _errorMessage: '',

  /**
    Flag: indicates whether JSON is editing now.

    @property _isEditing
    @type Boolean
    @default false
    @private
  */
  _isEditing: false,

  /**
    Strigified component's value.

    @property _jsonText
    @type String
    @default ''
  */
  _jsonText: '',

  /**
    Reference to component's CSS-classes names.
    Must be also a component's instance property to be available from component's .hbs template.
  */
  flexberryClassNames,

  /**
    Component's wrapping <div> CSS-classes names.

    Any other CSS-classes can be added through component's 'class' property.
    ```handlebars
    {{flexberry-jsonarea
      class="fluid"
    }}
    ```

    @property classNames
    @type String[]
    @default ['flexberry-jsonarea', 'ui', 'celled', 'grid']
  */
  classNames: [flexberryClassNames.wrapper, 'ui', 'celled', 'grid'],

  /**
    Component's placeholder.

    @property placeholder
    @type String
    @default t('components.flexberry-jsonarea.placeholder')
  */
  placeholder: t('components.flexberry-jsonarea.placeholder'),

  /**
    Flag: indicates whether component is in readonly mode or not.

    @property readonly
    @type Boolean
    @default false
  */
  readonly: false,

  /**
    Component's value.

    @property value
    @type Object
    @default null
  */
  value: null,

  actions: {
    onEditButtonClick() {
      if (this.get('readonly')) {
        return true;
      }

      let jsonMustBeSaved = this.get('_isEditing');
      if (jsonMustBeSaved) {
        try {
          let text = this.get('_jsonText');
          let value = isBlank(text) ? null : JSON.parse(text);
          this.set('value', value);

          this.set('_errorMessage', '');
          this.set('_showErrorMessage', false);

          this.toggleProperty('_isEditing');
        } catch (ex) {
          this.set('_errorMessage', ex.message);
          this.set('_showErrorMessage', true);
        }
      } else {
        this.toggleProperty('_isEditing');
      }
    },

    onErrorMessageShow() {
      this.set('_showErrorMessage', true);
    },

    onErrorMessageHide() {
      this.set('_showErrorMessage', false);
    }
  },

  init() {
    this._super(...arguments);
    this.get('_valueDidChange').apply(this);
  },

  /**
    Observes changes in value.
    Changes related stringified value.

    @method _valueDidChange
    @private
  */
  _valueDidChange: observer('value', function() {
    let value = this.get('value');
    if (isNone(value)) {
      this.set('_jsonText', '');
      return;
    }

    this.set('_jsonText', window.js_beautify(
      JSON.stringify(value)), {
        indent_size: 2
      }
    );
  })
});

// Add component's CSS-class names as component's class static constants
// to make them available outside of the component instance.
FlexberryJsonareaComponent.reopenClass({
  flexberryClassNames
});

export default FlexberryJsonareaComponent;
