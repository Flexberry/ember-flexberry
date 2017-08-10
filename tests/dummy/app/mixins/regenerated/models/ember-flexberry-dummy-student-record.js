import Ember from 'ember';
import DS from 'ember-data';
import { Projection } from 'ember-flexberry-data';
export let Model = Ember.Mixin.create({
  srFIO: DS.attr('string'),
  srCours: DS.attr('number'),
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
    _parentModelName: 'ember-flexberry-dummy-study-record'
  });
};

export let defineProjections = function (modelClass) {
  modelClass.defineProjection('StudentRecordE', 'ember-flexberry-dummy-student-record', {
    srFIO: Projection.attr('ФИО'),
    srCours: Projection.attr('Курс'),
    uniquelD: Projection.attr(''),
    objectPK: Projection.attr(''),
    showName: Projection.attr('', { hidden: true })
  });
};
