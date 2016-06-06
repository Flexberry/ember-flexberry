/* global moment:true */
import Ember from 'ember';
import Base from 'ember-validations/validators/base';
import Messages from 'ember-validations/messages';

var get = Ember.get;
var set = Ember.set;

export default Base.extend({
  init: function() {
    this._super();
    /*jshint expr:true*/
    if (this.options === true) {
      set(this, 'options', { allowBlank: false });
    }

    if (this.options.messages === undefined) {
      set(this, 'options.messages', {});
    }

    if (this.options.messages.blank === undefined) {
      this.options.messages.blank = Messages.render('blank', this.options);
    }

    if (this.options.messages.invalid === undefined) {
      this.options.messages.invalid = Messages.render('invalid', this.options);
    }
  },
  call: function() {
    if (Ember.isEmpty(get(this.model, this.property))) {
      if (!this.options.allowBlank) {
        this.errors.pushObject(this.options.messages.blank);
      }
    } else {
      if (!moment(get(this.model, this.property)).isValid()) {
        this.errors.pushObject(this.options.messages.invalid);
      }
    }
  }
});
