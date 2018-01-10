/**
  @module ember-flexberry
*/

import Ember from 'ember';
import BlockSlotComponent from 'ember-block-slots/components/block-slot';
import YieldSlotComponent from 'ember-block-slots/components/yield-slot';
import SlotsMixin from 'ember-block-slots';

/**
  Adds additional logic to <a href="https://github.com/ciena-blueplanet/ember-block-slots#usage">BlockSlots Mixin</a>
  for current application instance.

  @for ApplicationInstanceInitializer
  @method blockSlots.initialize
  @param {<a href="http://emberjs.com/api/classes/Ember.ApplicationInstance.html">Ember.ApplicationInstance</a>} applicationInstance Ember application instance.
*/
export function initialize(applicationInstance) {
  SlotsMixin.reopen({
    parentViewExcludingSlots: Ember.computed('parentView', 'targetObject', function() {
      let getParent = function(context) {
        return Ember.get(context, 'parentView') || Ember.get(context, 'targetObject');
      };

      let parent = getParent(this);
      while (!Ember.isNone(parent) && (parent instanceof BlockSlotComponent || parent instanceof YieldSlotComponent)) {
        parent = getParent(parent);
      }

      return parent;
    })
  });
}

export default {
  name: 'blockSlots',
  initialize
};
