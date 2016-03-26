/**
 * @module ember-flexberry
 */

import Ember from 'ember';

/**
 * Returns friezed object without prototype with own properties of parameter
 *
 * @function createEnum
 * @param {Object|Array} dictionary
 * @returns {Object}
 */
export function createEnum(dictionary) {
  let local = {};
  if (Ember.isArray(dictionary)) {
    dictionary.forEach(element => local[element] = element);
  } else {
    local = dictionary;
  }

  return Object.freeze(Ember.merge(Object.create(null), local));
}

/**
 * Returns friezed inversed object without prototype
 *
 * @param {Object} dictionary
 * @returns {Object}
 */
export function inverseEnum(dictionary) {
  let inverse = {};
  for (var key in dictionary) {
    inverse[dictionary[key]] = key;
  }

  return createEnum(inverse);
}

/**
 * Returns array of all property values
 *
 * @param dictionary
 * @returns {Array}
 */
export function enumCaptions(dictionary) {
  let captions = [];
  for (var key in dictionary) {
    captions.push(dictionary[key]);
  }

  return captions;
}

