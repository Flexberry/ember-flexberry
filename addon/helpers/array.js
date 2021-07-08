/**
  @module ember-flexberry
*/

import Helper from '@ember/component/helper';
import { A } from '@ember/array';

/**
  Array helper.
  Wraps given arguments into [Ember.NativeArray](https://emberjs.com/api/ember/release/classes/Ember.NativeArray)
  through a call to [A function](https://emberjs.com/api/ember/release/functions/@ember%2Farray/A).

  @class ArrayHelper
  @extends <a href="https://emberjs.com/api/ember/release/classes/Helper">Helper</a>

  Usage:
  templates/my-form.hbs
  ```handlebars
  {{my-component availableItems=(array 1 "two" 3 "four" 5)}}
  ```
  Following array will be passed to component's 'availableItems' property: [1, 'two', 3, 'four', 5].
*/
export default Helper.extend({
  /**
    Overridden [Helper compute method](https://emberjs.com/api/ember/release/classes/Helper#method_compute).
    Executes helper's logic, returns arguments wrapped into array.

    @method compute
    @param {any[]} args Arguments passed to helper, which must be wrapped into
    [Ember.NativeArray](https://emberjs.com/api/ember/release/classes/Ember.NativeArray).
    @return {[Ember.NativeArray](https://emberjs.com/api/ember/release/classes/Ember.NativeArray)} Wrapped arguments.
  */
  compute(args) {
    return A(args.slice());
  }
});
