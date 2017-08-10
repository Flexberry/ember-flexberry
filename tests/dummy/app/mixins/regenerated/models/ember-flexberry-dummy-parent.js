import Ember from 'ember';
import DS from 'ember-data';
import { Projection } from 'ember-flexberry-data';
export let Model = Ember.Mixin.create({
  name: DS.attr('string'),
  eMail: DS.attr('string'),
  birthday: DS.attr('date'),
  getValidations: function () {
    let parentValidations = this._super();
    let thisValidations = {
    };
    return Ember.$.extend(true, {}, parentValidations, thisValidations);
  },
  init: function () {
    this.set('validations', this.getValidations());
    this._super.apply(this, arguments);
  }
});
export let defineProjections = function (modelClass) {
  modelClass.defineProjection('parentE', 'ember-flexberry-dummy-parent', {
    name: Projection.attr(''),
    eMail: Projection.attr(''),
    birthday: Projection.attr('')
  });
  modelClass.defineProjection('parentL', 'ember-flexberry-dummy-parent', {
    name: Projection.attr(''),
    eMail: Projection.attr(''),
    birthday: Projection.attr('')
  });
};
