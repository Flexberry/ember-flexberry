
import Ember from 'ember';
import FlexberryBaseComponent from './flexberry-base-component';
import { translationMacro as t } from 'ember-i18n';

/**
  Component to view list of object.

  @class FlexberryObjectlistviewComponent
  @extends FlexberryBaseComponent
*/
export default FlexberryBaseComponent.extend({
    /**
    Service that triggers objectlistview events.

    @property objectlistviewEventsService
    @type Service
  */
 objectlistviewEventsService: Ember.inject.service('objectlistview-events'),

  actions: {
    /**
      Handles action from object-list-view when no handler for this component is defined.

      @method actions._gotoPage
      @public
      @param {Action} action Action go to page.
      @param {Number} pageNumber Number of page to go to.
    */
  
    gotoPage(action, pageNumber) {
      if (!action) {
        throw new Error('No handler for gotoPage action set for flexberry-objectlistview. ' +
                      'Set handler like {{flexberry-objectlistview ... gotoPage=(action "gotoPage")}}.');
      }

      // TODO: when we will ask user about actions with selected records clearing selected records won't be use, because it resets selecting on other pages.
      this._clearSelectedRecords();

      action(pageNumber, this.get('componentName'));
    },
  },

  /**
    Clear selected records on all pages.
    This method should be removed when we will ask user about actions with selected records.

    @method _clearSelectedRecords
    @private
  */
  _clearSelectedRecords() {
    let componentName = this.get('componentName');
    this.get('objectlistviewEventsService').clearSelectedRecords(componentName);
  },
});
