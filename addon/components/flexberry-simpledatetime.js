/**
 * @module ember-flexberry
 */

import Ember from 'ember';
import FlexberryBaseComponent from './flexberry-base-component';

/**
 * Wrapper for input type=date/datetime component.
 *
 * @class FlexberrySimpledatetime
 * @extends FlexberryBaseComponent
 * @uses Ember.TextSupport
 */
export default FlexberryBaseComponent.extend(Ember.TextSupport, {
  classNames: ['flexberry-simpledatetime'],
  tagName: 'input',
  attributeBindings: [
    'accept',
    'autocomplete',
    'autosave',
    'dir',
    'formaction',
    'formenctype',
    'formmethod',
    'formnovalidate',
    'formtarget',
    'height',
    'inputmode',
    'lang',
    'list',
    'max',
    'min',
    'multiple',
    'name',
    'pattern',
    'size',
    'step',
    'type',
    'value',
    'width',
    'readonly:readonlyAttr'
  ]
});
