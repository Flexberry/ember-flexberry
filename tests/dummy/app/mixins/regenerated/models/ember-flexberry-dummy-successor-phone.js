import Ember from 'ember';
import DS from 'ember-data';
import { Projection } from 'ember-flexberry-data';
export let Model = Ember.Mixin.create({
  phone1: DS.attr('string'),
  phone2: DS.attr('string'),
  phone3: DS.attr('string'),
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
export let defineBaseModel = function (modelClass) {
  modelClass.reopenClass({
    _parentModelName: 'ember-flexberry-dummy-parent'
  });
};

export let defineProjections = function (modelClass) {
  modelClass.defineProjection('SuccessorE', 'ember-flexberry-dummy-successor-phone', {
    name: Projection.attr('Name'),
    phone1: Projection.attr('Phone1'),
    phone2: Projection.attr('Phone2'),
    phone3: Projection.attr('Phone3')
  });
  modelClass.defineProjection('SuccessorL', 'ember-flexberry-dummy-successor-phone', {
    name: Projection.attr('Name'),
    phone1: Projection.attr('Phone1'),
    phone2: Projection.attr('Phone2'),
    phone3: Projection.attr('Phone3')
  });
};
