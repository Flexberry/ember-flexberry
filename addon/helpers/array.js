/**
  @module ember-flexberry
*/

import Helper from '@ember/component/helper';
import { A } from '@ember/array';

/**
  Array helper.
  Wraps given arguments into [Ember.NativeArray](http://emberjs.com/api/classes/Ember.NativeArray.html)
  through a call to [Ember.A method](http://emberjs.com/api/classes/Ember.html#method_A).

  @class ArrayHelper
  @extends <a href="http://emberjs.com/api/classes/Ember.Helper.html">Ember.Helper</a>

  Usage:
  templates/my-form.hbs
  ```handlebars
  {{my-component availableItems=(array 1 "two" 3 "four" 5)}}
  ```
  Following array will be passed to component's 'availableItems' property: [1, 'two', 3, 'four', 5].
*/
export default Helper.extend({
  /**
    Overridden [Ember.Helper compute method](http://emberjs.com/api/classes/Ember.Helper.html#method_compute).
    Executes helper's logic, returns arguments wrapped into array.

    @method compute
    @param {any[]} args Arguments passed to helper, which must be wrapped into
    [Ember.NativeArray](http://emberjs.com/api/classes/Ember.NativeArray.html).
    @return {[Ember.NativeArray](http://emberjs.com/api/classes/Ember.NativeArray.html)} Wrapped arguments.
  */
  compute(args) {
    return A(args);
  }
});
