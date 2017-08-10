import Ember from 'ember';
import DS from 'ember-data';
import { Projection } from 'ember-flexberry-data';
export let Model = Ember.Mixin.create({
  masterText: DS.attr('string'),
  lazyLoadingDetail: DS.hasMany('ember-flexberry-dummy-lazy-loading-detail', { inverse: 'lazyLoadingMaster', async: false }),
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
  modelClass.defineProjection('LazyLoadingMasterEdit', 'ember-flexberry-dummy-lazy-loading-master', {
    masterText: Projection.attr('Master text'),
    lazyLoadingDetail: Projection.hasMany('ember-flexberry-dummy-lazy-loading-detail', 'Detail', {
      detailText: Projection.attr('Detail text')
    })
  });
  modelClass.defineProjection('LazyLoadingMasterList', 'ember-flexberry-dummy-lazy-loading-master', {
    masterText: Projection.attr('Master text')
  });
};
