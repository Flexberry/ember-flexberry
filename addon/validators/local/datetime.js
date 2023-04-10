/* global moment:true */
import { isEmpty } from '@ember/utils';
import { get, set } from '@ember/object';
import Base from 'ember-validations/validators/base';
import Messages from 'ember-validations/messages';

export default Base.extend({
  /**
    An overridable method called when objects are instantiated.
    For more information see [init](https://emberjs.com/api/ember/release/classes/EmberObject/methods/init?anchor=init) method of [EmberObject](https://emberjs.com/api/ember/release/classes/EmberObject).
  */
  init() {
    this._super(...arguments);
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

  call() {
    if (isEmpty(get(this.model, this.property))) {
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
