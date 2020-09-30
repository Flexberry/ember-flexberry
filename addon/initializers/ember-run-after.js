/**
  @module ember-flexberry
*/

import Ember from 'ember';
import runAfter from '../utils/run-after';

/**
  Injects 'after' method into 'Ember.run' namespace.

  @for ApplicationInitializer
  @method emberRunAfter.initialize
*/
export function initialize() {
  Ember.run.after = runAfter;
}

export default {
  name: 'ember-run-after',
  initialize
};
