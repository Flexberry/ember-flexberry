/**
 * @module ember-flexberry
 */

import FlexberryBaseComponent from './flexberry-base-component';
import FlexberryLookupCompatibleComponentMixin from '../mixins/flexberry-lookup-compatible-component';
import FlexberryFileCompatibleComponentMixin from '../mixins/flexberry-file-compatible-component';

/**
 * @class ObjectListViewSingleColumnCell
 * @extends FlexberryBaseComponent
 */
export default FlexberryBaseComponent.extend(
  FlexberryLookupCompatibleComponentMixin,
  FlexberryFileCompatibleComponentMixin, {
  /**
   * Component's CSS class names.
   */
  classNames: ['object-list-view-single-column-cell', 'ui', 'form'],

  /**
   * Displaying model.
   *
   * @property model
   * @type DS.Model
   * @default null
   */
  model: null,

  /**
   * Columns for model.
   *
   * @property value
   * @type Object[]
   * @default null
   */
  columns: null,

  /**
   * Flag: indicates whether there are some editable values in cell.
   *
   * @property hasEditableValues
   * @type Boolean
   * @default false
   */
  hasEditableValues: false,

  /**
   * Initializes component.
   */
  init: function() {
    this._super(...arguments);
  }
});
