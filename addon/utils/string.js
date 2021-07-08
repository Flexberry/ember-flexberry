/**
  @module ember-flexberry
*/

import { typeOf} from '@ember/utils';
import { get } from '@ember/object';
import { copy } from '@ember/object/internals';
import { merge } from '@ember/polyfills';

/**
  Renders strings containing some templates inside.

  @for Utils.Layers
  @method render
  @param {String} stringWithTemplates String containing templates which need to be rendered
  @param {Object} [options] Render options.
  @param {Object} [options.context = {}] Rendering context containing properties which will be substituted into string
  instead of related templates.
  @param {String[]} [options.delimiters = ['{{', '}}']] Delimiters which will be used to retrieve templated parts
  from the given string.
  @return {String} Rendered string (where templated parts are replaced with context's related properties).

  Usage:
  controllers/my-form.js
  ```javascript
    import { render } from 'ember-flexberry/utils/string'l

    // It will return: 'I have 1 dollar in my wallet, 2 apples in my bag, and 3 hours of free time'.
    render('I have {{ one }} dollar in my wallet, {{ two }} apples in my bag, and {{ three }} hours of free time', {
      context: { one: 1, two: 2, three: 3 }
    });

    // It will return: 'I have 1 dollar in my wallet, 2 apples in my bag, and 3 hours of free time'.
    render('I have {% one %} dollar in my wallet, {% two %} apples in my bag, and {% three %} hours of free time', {
      context: { one: 1, two: 2, three: 3 },
      delimiters: ['{%', '%}']
    });

  ```
*/
let render = function(stringWithTemplates, options) {
  if (typeOf(stringWithTemplates) !== 'string') {
    return null;
  }

  options = merge({
    context: {},
    delimiters: ['{{', '}}']
  }, options || {});

  let context = get(options, 'context') || {};
  let delimiters = get(options, 'delimiters');
  let [leftDelimiter, rightDelimiter] = delimiters;

  let renderedString = copy(stringWithTemplates);
  let keyWords = Object.keys(context);
  for (let i = 0, len = keyWords.length; i < len; i++) {
    let keyWord = keyWords[i];
    let replacement = get(context, keyWord);

    renderedString = renderedString.replace(
      new RegExp(leftDelimiter + '\\s*' + keyWord + '\\s*' + rightDelimiter, 'g'),
      replacement);
  }

  return renderedString;
};

export { render };
