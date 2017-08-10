import Ember from 'ember';
import DS from 'ember-data';
import { Projection } from 'ember-flexberry-data';
export let Model = Ember.Mixin.create({
  createTime: DS.attr('date'),
  creator: DS.attr('string'),
  editTime: DS.attr('date'),
  editor: DS.attr('string'),
  order: DS.attr('number'),
  file: DS.attr('file'),
  suggestion: DS.belongsTo('ember-flexberry-dummy-suggestion', { inverse: 'files', async: false, polymorphic: true }),
  getValidations: function () {
    let parentValidations = this._super();
    let thisValidations = {
      suggestion: { presence: true }
    };
    return Ember.$.extend(true, {}, parentValidations, thisValidations);
  },
  init: function () {
    this.set('validations', this.getValidations());
    this._super.apply(this, arguments);
  }
});
export let defineProjections = function (modelClass) {
  modelClass.defineProjection('AuditView', 'ember-flexberry-dummy-suggestion-file', {
    order: Projection.attr('Order'),
    file: Projection.attr('File')
  });
  modelClass.defineProjection('SuggestionFileE', 'ember-flexberry-dummy-suggestion-file', {
    order: Projection.attr('Order'),
    file: Projection.attr('File'),
    suggestion: Projection.belongsTo('ember-flexberry-dummy-suggestion', '', {

    }, { hidden: true })
  });
};
