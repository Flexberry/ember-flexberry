/**
  @module ember-flexberry
*/

import Mixin from '@ember/object/mixin';
import { typeOf } from '@ember/utils';
import { assert } from '@ember/debug';
import { setRecord } from '../utils/extended-set';

/**
  Mixin containing handlers for
  {{#crossLink "FlexberryDdauSliderComponent"}}flexberry-ddau-slider component's{{/crossLink}} actions.

  @class FlexberryDdauSliderActionsHandlerMixin
  @extends <a href="http://emberjs.com/api/classes/Ember.Mixin.html">Ember.Mixin</a>
*/
export default Mixin.create({
  actions: {
    /**
      Handles {{#crossLink "FlexberryDdauSliderComponent/sendingActions.change:method"}}flexberry-ddau-slider component's 'change' action{{/crossLink}}.
      It mutates value of property with given name to value of action's event object 'newValue' property.

      @method actions.onSliderChange
      @param {String} mutablePropertyPath Path to a property, which value must be mutated on action.
      @param {Object} e Action's event object.
      @param {Object} e.newValue New value for a property, which value must be mutated on action.
      @param {Object} e.originalEvent [jQuery event object](http://api.jquery.com/category/events/event-object/)
      which describes checkbox input's 'change' event.

      @example
      templates/my-form.hbs
      ```handlebars
        {{flexberry-ddau-slider
          value=model.opacity
          change=(action "onSliderChange" "model.opacity")
        }}
      ```

      controllers/my-form.js
      ```javascript
        import Controller from '@ember/controller';
        import FlexberryDdauSliderActionsHandlerMixin from 'ember-flexberry/mixins/flexberry-ddau-slider-actions-handler';

        export default Controller.extend(FlexberryDdauSliderActionsHandlerMixin, {
        });
      ```
    */
    onSliderChange(...args) {
      // User can pass any additional arguments to action handler,
      // so original action's event object will be the last one in arguments array.
      let mutablePropertyPath = args[0];
      let e = args[args.length - 1];

      let mutablePropertyPathType = typeOf(mutablePropertyPath);
      assert(
        `Wrong type of \`mutablePropertyPath\` argument: actual type is \`${mutablePropertyPathType}\`, ` +
        `but \`string\` is expected`,
        mutablePropertyPathType === 'string');

      setRecord(this, mutablePropertyPath, e.newValue);
    }
  }
});
