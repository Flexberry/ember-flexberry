/**
  @module ember-flexberry
*/

import FlexberryBaseComponent from './flexberry-base-component';
import FlexberryLookupCompatibleComponentMixin from '../mixins/flexberry-lookup-compatible-component';
import FlexberryFileCompatibleComponentMixin from '../mixins/flexberry-file-compatible-component';

/**
  @class ObjectListViewSingleColumnCellComponent
  @extends FlexberryBaseComponent
  @uses FlexberryLookupCompatibleComponentMixin
  @uses FlexberryFileCompatibleComponentMixin
*/
export default FlexberryBaseComponent.extend(
  FlexberryLookupCompatibleComponentMixin,
  FlexberryFileCompatibleComponentMixin, {
  /**
    Component's wrapping <div> CSS-class names.
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
    Flag indicates whether there are some editable values in cell.

    @property hasEditableValues
    @type Boolean
    @default false
  */
  hasEditableValues: false,

  /**
    Flag: indicates whether to show validation messages or not.

    @property showValidationMessages
    @type Boolean
    @default false
  */
  showValidationMessages: true,

  /**
    An overridable method called when objects are instantiated.
    For more information see [init](https://emberjs.com/api/ember/release/classes/EmberObject/methods/init?anchor=init) method of [EmberObject](https://emberjs.com/api/ember/release/classes/EmberObject).
    Initializes {{#crossLink "ObjectListViewSingleColumnCellComponent"}}object-list-view-single-column-cell{{/crossLink}} component.
   */
  init() {
    this._super(...arguments);
  }
});
