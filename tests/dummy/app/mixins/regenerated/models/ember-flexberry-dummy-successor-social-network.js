import Ember from 'ember';
import DS from 'ember-data';
import { Projection } from 'ember-flexberry-data';
export let Model = Ember.Mixin.create({
  vK: DS.attr('string'),
  facebook: DS.attr('string'),
  twitter: DS.attr('string'),
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
  modelClass.defineProjection('SuccessorE', 'ember-flexberry-dummy-successor-social-network', {
    name: Projection.attr('Name'),
    vK: Projection.attr('VK'),
    facebook: Projection.attr('Facebook'),
    twitter: Projection.attr('Twitter')
  });
  modelClass.defineProjection('SuccessorL', 'ember-flexberry-dummy-successor-social-network', {
    name: Projection.attr('Name'),
    vK: Projection.attr('VK'),
    facebook: Projection.attr('Facebook'),
    twitter: Projection.attr('Twitter')
  });
};
