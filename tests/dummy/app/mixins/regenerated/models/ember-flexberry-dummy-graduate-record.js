import Ember from 'ember';
import DS from 'ember-data';
import { Projection } from 'ember-flexberry-data';
export let Model = Ember.Mixin.create({
  grFIO: DS.attr('string'),
  grYearGrad: DS.attr('number'),
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
  modelClass.defineProjection('GraduateRecordE', 'ember-flexberry-dummy-graduate-record', {
    grFIO: Projection.attr('ФИО'),
    grYearGrad: Projection.attr('Год выпуска'),
    uniquelD: Projection.attr(''),
    objectPK: Projection.attr(''),
    showName: Projection.attr('', { hidden: true })
  });
};
