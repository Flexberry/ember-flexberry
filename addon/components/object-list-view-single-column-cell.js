/**
 * @module ember-flexberry
*/

import FlexberryBaseComponent from './flexberry-base-component';
import FlexberryLookupCompatibleComponentMixin from '../mixins/flexberry-lookup-compatible-component';
import FlexberryFileCompatibleComponentMixin from '../mixins/flexberry-file-compatible-component';

/**
  @class ObjectListViewSingleColumnCellComponent
  @extends FlexberryBaseComponent
  @uses FlexberryLookupCompatibleComponentMixin
  @uses FlexberryLookupCompatibleComponentMixin
*/
export default FlexberryBaseComponent.extend(
  FlexberryLookupCompatibleComponentMixin,
  FlexberryFileCompatibleComponentMixin, {
  /**
    Component's wrapping <div> CSS-class names.

    @property classNames
    @type String[]
    @default ['object-list-view-single-column-cell', 'ui', 'form']
  */
  classNames: ['object-list-view-single-column-cell', 'ui', 'form'],

  /**
    Model which need to be displayed by component.

    @property model
    @type <a href="http://emberjs.com/api/data/classes/DS.Model.html">DS.Model</a>
    @default null
  */
  model: null,

  /**
    Array containing metadata for model's related columns.

    @property value
    @type Object[]
    @default null
  */
  columns: null,

  /**
    Flag: indicates whether there are some editable values in cell.

    @property hasEditableValues
    @type Boolean
    @default false
  */
  hasEditableValues: false,

  /**
    Initializes {{#crossLink "ObjectListViewSingleColumnCellComponent"}}object-list-view-single-column-cell{{/crossLink}} component.
  */
  init: function() {
    this._super(...arguments);
  }
});
