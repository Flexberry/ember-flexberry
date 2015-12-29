/**
 * @module ember-flexberry
 */

import BaseComponent from './flexberry-base-component';

export default BaseComponent.extend({
  tagName: 'td',
  classNames: [],
  column: null,
  record: null
});
