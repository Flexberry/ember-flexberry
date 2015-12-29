/**
 * @module ember-flexberry
 */

import Ember from 'ember';

export default Ember.Component.extend({
  modalWindowHeight: undefined,
  modalWindowWidth: undefined,
  modalWindowContentHeight: 400,
  modalWindowHeightComputed: Ember.computed('modalWindowHeight', function() {
    var height = this.get('modalWindowHeight');
    if (height && typeof height === 'number') {
      return height;
    }

    return 600;
  }),
  modalWindowWidthComputed: Ember.computed('modalWindowWidth', function() {
    var width = this.get('modalWindowWidth');
    if (width && typeof width === 'number') {
      return width;
    }

    return 750;
  }),
  modalWindowContentHeightComputed: Ember.computed('modalWindowContentHeight', function() {
    var height = this.get('modalWindowContentHeight');
    if (height && typeof height === 'number') {
      return height;
    }

    return 400;
  }),
  didInsertElement: function() {
      var _this = this;
      this.$('.ui.modal').modal('setting', {
        onApprove: function() {
          _this.sendAction('ok');
        },
        onDeny: function() {
          _this.sendAction('close');
        },
        onHidden: function() {
          _this.sendAction('close');
          this.remove();
        },
        onVisible: function() {
          var wholeHeight = Ember.$(this).height();
          var headHeight = Ember.$('.header', this).height();
          var actionsHeight = Ember.$('.actions', this).height();
          var closeHeight = Ember.$('.close', this).height();
          var result = wholeHeight - headHeight - actionsHeight - closeHeight - 50;
          _this.set('modalWindowContentHeight', result);
          _this.sendAction('created', Ember.$(this));
        }
      }).modal('show');
    }
});
