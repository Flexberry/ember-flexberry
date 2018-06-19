/**
  @module ember-flexberry
*/

import Component from '@ember/component';
import { computed } from '@ember/object';

/**
  Component for output messages of validation errors as a [Semantic UI Label](https://semantic-ui.com/elements/label.html) element.

  @example
    ```handlebars
    {{flexberry-validationmessage
      color="pink"
      pointing="left pointing"
      error=error
    }}
    ```

  @class FlexberryValidationmessageComponent
  @extends <a href="https://emberjs.com/api/ember/release/classes/Component">Component</a>
*/
export default Component.extend({
  /**
    See [EmberJS API](https://emberjs.com/api/).

    @property classNameBindings
    @type Array
    @default ['color', 'pointing']
  */
  classNameBindings: ['color', 'pointing'],

  /**
    See [EmberJS API](https://emberjs.com/api/).

    @property classNames
    @type Array
    @default ['ui', 'basic', 'label']
  */
  classNames: ['ui', 'basic', 'label'],

  /**
    See [EmberJS API](https://emberjs.com/api/).

    @property isVisible
  */
  isVisible: computed.notEmpty('error'),

  /**
    See [Semantic UI API](https://semantic-ui.com/elements/label.html#colored).

    @property color
    @type String
    @default 'red'
  */
  color: 'red',

  /**
    See [Semantic UI API](https://semantic-ui.com/elements/label.html#pointing).

    @property pointing
    @type String
    @default 'pointing'
  */
  pointing: 'pointing',

  /**
    Message or array of error messages.

    @property error
    @type Array|String
  */
  error: undefined,
});
