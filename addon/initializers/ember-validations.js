/**
  @module ember-flexberry
*/

import Ember from 'ember';
import Errors from 'ember-validations/errors';

const { Evented, defineProperty } = Ember;

/**
  Adds the `errorListChanged` event to errors object from `ember-validations` addon.

  @for ApplicationInitializer
  @method emberValidations.initialize
*/
export function initialize() {
  Errors.reopen(Evented, {
    setUnknownProperty(key, value) {
      defineProperty(this, key, undefined, value);

      this.trigger('errorListChanged');
    },
  });
}

export default {
  name: 'ember-validations',
  initialize
};
