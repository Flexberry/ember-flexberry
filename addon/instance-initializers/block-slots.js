/**
  @module ember-flexberry
*/

import { isNone } from '@ember/utils';
import { get, computed } from '@ember/object';
import BlockSlotComponent from 'ember-block-slots/components/block-slot';
import YieldSlotComponent from 'ember-block-slots/components/yield-slot';
import SlotsMixin from 'ember-block-slots';

/**
  Adds additional logic to <a href="https://github.com/ciena-blueplanet/ember-block-slots#usage">BlockSlots Mixin</a>
  for current application instance.

  @for ApplicationInstanceInitializer
  @method blockSlots.initialize
  @param {<a href="https://www.emberjs.com/api/ember/release/classes/ApplicationInstance">ApplicationInstance</a>} applicationInstance Ember application instance.
*/
/* eslint-disable no-unused-vars */
export function initialize(applicationInstance) {
  SlotsMixin.reopen({
    parentViewExcludingSlots: computed('parentView', 'targetObject', function() {
      let getParent = function(context) {
        return get(context, 'parentView') || get(context, 'targetObject');
      };

      let parent = getParent(this);
      while (!isNone(parent) && (parent instanceof BlockSlotComponent || parent instanceof YieldSlotComponent)) {
        parent = getParent(parent);
      }

      return parent;
    })
  });
}
/* eslint-enable no-unused-vars */

export default {
  name: 'blockSlots',
  initialize
};
