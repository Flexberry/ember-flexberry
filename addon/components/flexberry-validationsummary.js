/**
  @module ember-flexberry
*/

import Component from '@ember/component';
import { computed } from '@ember/object';

/**
  Component for output messages of validation errors as a [Semantic UI Message](https://semantic-ui.com/collections/message.html) collection.

  @example
    ```handlebars
    {{flexberry-validationsummary
      color="orange"
      header="Validation errors"
      errors=errors
    }}
    ```

  @class FlexberryValidationsummaryComponent
  @extends <a href="https://emberjs.com/api/ember/release/classes/Component">Component</a>
*/
export default Component.extend({
  /**
    See [EmberJS API](https://emberjs.com/api/).

    @property classNameBindings
    @type Array
    @default ['color']
  */
  classNameBindings: ['color'],

  /**
    See [EmberJS API](https://emberjs.com/api/).

    @property classNames
    @type Array
    @default ['ui', 'message']
  */
  classNames: ['ui', 'message'],

  /**
    See [EmberJS API](https://emberjs.com/api/).

    @property isVisible
  */
  isVisible: computed.notEmpty('errors'),

  /**
    See [Semantic UI API](https://semantic-ui.com/collections/message.html#colored).

    @property color
    @type String
    @default 'red'
  */
  color: 'red',

  /**
    Header.

    @property header
    @type String
  */
  header: undefined,

  /**
    List of errors for output.

    @property errors
    @type Array
  */
  errors: undefined,
});
