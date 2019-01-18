import Ember from 'ember';
import DS from 'ember-data';
import { Projection } from 'ember-flexberry-data';
export let Model = Ember.Mixin.create({
  name: DS.attr('string'),
  detail: DS.hasMany('ember-flexberry-dummy-detail', { inverse: 'master', async: false }),
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

export function defineNamespace(modelClass) {
  modelClass.reopenClass({
    namespace: 'EmberFlexberryDummy',
  });
}

export let defineProjections = function (modelClass) {
  modelClass.defineProjection('MasterEdit', 'ember-flexberry-dummy-master', {
    name: Projection.attr('Name'),
    detail: Projection.hasMany('ember-flexberry-dummy-detail', 'Detail', {
      name: Projection.attr(''),
      parentDetail: Projection.belongsTo('ember-flexberry-dummy-detail', '', {
        name: Projection.attr('', { hidden: true })
      }, { displayMemberPath: 'name' })
    })
  });
  modelClass.defineProjection('MasterList', 'ember-flexberry-dummy-master', {
    name: Projection.attr('Name')
  });
};
