import Ember from 'ember';
import DS from 'ember-data';
import { Projection } from 'ember-flexberry-data';
export let Model = Ember.Mixin.create({
  createTime: DS.attr('date'),
  creator: DS.attr('string'),
  editTime: DS.attr('date'),
  editor: DS.attr('string'),
  name: DS.attr('string'),
  getValidations: function () {
    let parentValidations = this._super();
    let thisValidations = {
      name: { presence: true }
    };
    return Ember.$.extend(true, {}, parentValidations, thisValidations);
  },
  init: function () {
    this.set('validations', this.getValidations());
    this._super.apply(this, arguments);
  }
});
export let defineProjections = function (modelClass) {
  modelClass.defineProjection('AuditView', 'ember-flexberry-dummy-localization', {
    name: Projection.attr('Name')
  });
  modelClass.defineProjection('LocalizationE', 'ember-flexberry-dummy-localization', {
    name: Projection.attr('Name')
  });
  modelClass.defineProjection('LocalizationL', 'ember-flexberry-dummy-localization', {
    name: Projection.attr('Name')
  });
};
