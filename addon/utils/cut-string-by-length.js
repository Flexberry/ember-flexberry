/**
  @module ember-flexberry
*/

import { isBlank } from '@ember/utils';

/**
  Cuts string by specified length.

  @method cutStringByLength
  @param {String} value Specified string.
  @param {Integer} maxTextLength Maximum string length.
  @param {Boolean} cutBySpaces If true, string will be cutted by space.
  @return {String} Cutted string with ellipsis.
*/
export default function cutStringByLength(value, maxTextLength, cutBySpaces) {
  if (isBlank(value) || !maxTextLength) {
    return value;
  }

  const formattedValue = String(value);

  let result = formattedValue.substr(0, maxTextLength);
  if (cutBySpaces && !isBlank(formattedValue[maxTextLength])) {
    const spaceIndex = result.lastIndexOf(' ');
    if (spaceIndex > -1) {
      result = result.substring(0, spaceIndex);
    }
  }

  return result === formattedValue ? result : result + '...';
}
