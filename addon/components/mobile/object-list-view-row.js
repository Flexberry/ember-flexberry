/**
  @module ember-flexberry
*/

import { computed  } from '@ember/object';
import { later, cancel } from '@ember/runloop';
import ObjectListViewRowComponent from '../object-list-view-row';

/**
  Mobile version of {{#crossLink "ObjectListViewRowComponent"}}{{/crossLink}} (with mobile-specific defaults).

  @class Mobile.ObjectListViewRowComponent
  @extends ObjectListViewRowComponent
*/
export default ObjectListViewRowComponent.extend({
  /**
    Stores the number of pixels to isolate one level of hierarchy.

    @property _hierarchicalIndent
    @type Number
    @default 10
    @private
  */
  _hierarchicalIndent: 10,

  /**
    Number of pixels to isolate the current level of the hierarchy.

    @property hierarchicalIndent
    @type Number
    @default 10
  */
  hierarchicalIndent: computed({
    get() {
      return (this.get('_currentLevel') + 1) * this.get('_hierarchicalIndent');
    },
    set(key, value) {
      if (value !== undefined) {
        this.set('_hierarchicalIndent', +value);
      }

      return this.get('hierarchicalIndent');
    },
  }),

  /**
    Flag indicates whether it is needed to prevent default touch end behavior (if `true`) or not (if `false`)

    @property preventDefaultTouchEnd
    @type Boolean
    @default false
  */
  preventDefaultTouchEnd: false,

  /**
    Toggles current row selection

    @method _toggleSelection
    @private
  */
  _toggleSelection() {
    let record = this.get('record');
    record.toggleProperty('selected');
    let e = { checked: record.get('selected') };
    this.selectRow(record, e);
    this.set('preventDefaultTouchEnd', true);
  },

  /**
    Runs delayed selection toggle

    @method _runDelayedSelection
    @private
  */
  _runDelayedSelection() {
    let longTouchDurationMs = 300;
    let delayedSelection = later(this, this._toggleSelection, longTouchDurationMs);
    this.set('delayedSelection', delayedSelection);
  },

  /**
    Cancels delayed selection toggle

    @method _cancelDelayedSelection
    @private
  */
  _cancelDelayedSelection() {
    let delayedSelection = this.get('delayedSelection');
    cancel(delayedSelection);
    this.set('preventDefaultTouchEnd', false);
  },

  actions: {
    /**
     This action is called when the user touches an element.

     @method actions.onTouchStart
     @public
    */
    onTouchStart() {
      this._runDelayedSelection();
    },

    /**
     This action is called when the user moves the finger across the screen.

     @method actions.onTouchMove
     @public
    */
    onTouchMove() {
      this._cancelDelayedSelection();
    },

    /**
     This action is called when the user removes the finger from an element.

     @method actions.onTouchEnd
     @public
    */
    onTouchEnd() {
      this._cancelDelayedSelection();
    },

    /**
     This action is called when the touch is interrupted.

     @method actions.onTouchCancel
     @public
    */
    onTouchCancel() {
      this._cancelDelayedSelection();
    }
  }
});
