import Ember from 'ember';
import DS from 'ember-data';
import { Projection } from 'ember-flexberry-data';
export let Model = Ember.Mixin.create({
  name: DS.attr('string'),
  parentDetail: DS.belongsTo('ember-flexberry-dummy-detail', { inverse: null, async: false }),
  master: DS.belongsTo('ember-flexberry-dummy-master', { inverse: 'detail', async: false }),
  getValidations: function () {
    let parentValidations = this._super();
    let thisValidations = {
      master: { presence: true }
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
  modelClass.defineProjection('Detail', 'ember-flexberry-dummy-detail', {
    name: Projection.attr(''),
    parentDetail: Projection.belongsTo('ember-flexberry-dummy-detail', '', {
      name: Projection.attr('', { hidden: true })
    }, { displayMemberPath: 'name' })
  });
};
