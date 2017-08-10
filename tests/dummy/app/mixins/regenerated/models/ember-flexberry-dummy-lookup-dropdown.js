import Ember from 'ember';
import DS from 'ember-data';
import { Projection } from 'ember-flexberry-data';
export let Model = Ember.Mixin.create({
  name: DS.attr('string'),
  masterLookupDropdown: DS.belongsTo('ember-flexberry-dummy-master-lookup-dropdown', { inverse: null, async: false }),
  getValidations: function () {
    let parentValidations = this._super();
    let thisValidations = {
      masterLookupDropdown: { presence: true }
    };
    return Ember.$.extend(true, {}, parentValidations, thisValidations);
  },
  init: function () {
    this.set('validations', this.getValidations());
    this._super.apply(this, arguments);
  }
});
export let defineProjections = function (modelClass) {
  modelClass.defineProjection('LookupDropdown', 'ember-flexberry-dummy-lookup-dropdown', {
    name: Projection.attr('', { hidden: true }),
    masterLookupDropdown: Projection.belongsTo('ember-flexberry-dummy-master-lookup-dropdown', 'Master lookup dropdown', {
      text: Projection.attr('', { hidden: true })
    }, { displayMemberPath: 'text' })
  });
};
