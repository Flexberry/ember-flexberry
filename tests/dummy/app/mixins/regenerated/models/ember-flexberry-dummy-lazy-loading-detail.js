import Ember from 'ember';
import DS from 'ember-data';
import { Projection } from 'ember-flexberry-data';
export let Model = Ember.Mixin.create({
  detailText: DS.attr('string'),
  lazyLoadingMaster: DS.belongsTo('ember-flexberry-dummy-lazy-loading-master', { inverse: 'lazyLoadingDetail', async: false }),
  getValidations: function () {
    let parentValidations = this._super();
    let thisValidations = {
      lazyLoadingMaster: { presence: true }
    };
    return Ember.$.extend(true, {}, parentValidations, thisValidations);
  },
  init: function () {
    this.set('validations', this.getValidations());
    this._super.apply(this, arguments);
  }
});
export let defineProjections = function (modelClass) {
  modelClass.defineProjection('LazyLoadingDetailEdit', 'ember-flexberry-dummy-lazy-loading-detail', {
    detailText: Projection.attr('Detail text')
  });
};
