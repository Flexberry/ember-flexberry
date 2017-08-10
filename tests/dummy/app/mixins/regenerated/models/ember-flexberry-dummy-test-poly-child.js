import Ember from 'ember';
import DS from 'ember-data';
import { Projection } from 'ember-flexberry-data';
export let Model = Ember.Mixin.create({
  childPole: DS.attr('number'),
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
    _parentModelName: 'ember-flexberry-dummy-test-poly-base'
  });
};

export let defineProjections = function (modelClass) {
  modelClass.defineProjection('TestPolyChildEdit', 'ember-flexberry-dummy-test-poly-child', {
    pole: Projection.attr(''),
    childPole: Projection.attr('')
  });
  modelClass.defineProjection('TestPolyChildList', 'ember-flexberry-dummy-test-poly-child', {
    pole: Projection.attr('Pole'),
    childPole: Projection.attr('ChildPole')
  });
};
