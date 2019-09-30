/**
  @module ember-flexberry
*/

import Ember from 'ember';

/**
  Cuts string by specified length.

  @method cutStringByLength
  @param {String} value Specified string.
  @param {Integer} maxTextLength Maximum string length.
  @param {Boolean} cutBySpaces If true, string will be cutted by space.
  @return {String} Cutted string with ellipsis.
*/
export default function cutStringByLength(value, maxTextLength, cutBySpaces) {
  let result = value.substr(0, maxTextLength);
  if (cutBySpaces && !Ember.isBlank(value[maxTextLength])) {
    const spaceIndex = result.lastIndexOf(' ');
    if (spaceIndex > -1) {
      result = result.substring(0, spaceIndex);
    }
  }

  return result === value ? result : result + '...';
}
