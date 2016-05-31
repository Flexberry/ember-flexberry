/**
  @module ember-flexberry
*/

import FlexberryBaseComponent from './flexberry-base-component';
import FlexberryLookupCompatibleComponentMixin from '../mixins/flexberry-lookup-compatible-component';

/**
  @class ObjectListViewSingleColumnCell
  @extends FlexberryBaseComponent
  @uses FlexberryLookupCompatibleComponentMixin
*/
export default FlexberryBaseComponent.extend(FlexberryLookupCompatibleComponentMixin, {
  /**
    Default classes for component wrapper.
  */
  classNames: ['object-list-view-single-column-cell', 'ui', 'form'],

  /**
    Displaying model.

    @property model
    @type DS.Model
    @default null
  */
  model: null,

  /**
    Columns for model.

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
    An overridable method called when objects are instantiated.
    For more information see [init](http://emberjs.com/api/classes/Ember.View.html#method_init) method of [Ember.View](http://emberjs.com/api/classes/Ember.View.html).
   */
  init() {
    this._super(...arguments);
  }
});
