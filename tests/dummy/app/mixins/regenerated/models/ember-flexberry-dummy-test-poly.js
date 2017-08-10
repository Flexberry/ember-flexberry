import Ember from 'ember';
import DS from 'ember-data';
import { Projection } from 'ember-flexberry-data';
export let Model = Ember.Mixin.create({
  selfPole: DS.attr('string'),
  relation: DS.belongsTo('ember-flexberry-dummy-test-poly-base', { inverse: null, async: false, polymorphic: true }),
  getValidations: function () {
    let parentValidations = this._super();
    let thisValidations = {
      relation: { presence: true }
    };
    return Ember.$.extend(true, {}, parentValidations, thisValidations);
  },
  init: function () {
    this.set('validations', this.getValidations());
    this._super.apply(this, arguments);
  }
});
export let defineProjections = function (modelClass) {
  modelClass.defineProjection('TestPolyEdit', 'ember-flexberry-dummy-test-poly', {
    selfPole: Projection.attr('Self Pole'),
    relation: Projection.belongsTo('ember-flexberry-dummy-test-poly-base', 'Relation', {
      pole: Projection.attr('Pole', { hidden: true })
    }, { displayMemberPath: 'pole' })
  });
  modelClass.defineProjection('TestPolyList', 'ember-flexberry-dummy-test-poly', {
    selfPole: Projection.attr('SelfPole'),
    relation: Projection.belongsTo('ember-flexberry-dummy-test-poly-base', '', {
      pole: Projection.attr('Pole', { hidden: true })
    }, { displayMemberPath: 'pole' })
  });
};
