import Ember from 'ember';
import DS from 'ember-data';
import { Projection } from 'ember-flexberry-data';
export let Model = Ember.Mixin.create({
  createTime: DS.attr('date'),
  creator: DS.attr('string'),
  editTime: DS.attr('date'),
  editor: DS.attr('string'),
  name: DS.attr('string'),
  moderated: DS.attr('boolean'),
  parent: DS.belongsTo('ember-flexberry-dummy-suggestion-type', { inverse: null, async: false }),
  localizedTypes: DS.hasMany('ember-flexberry-dummy-localized-suggestion-type', { inverse: 'suggestionType', async: false }),
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
  modelClass.defineProjection('AuditView', 'ember-flexberry-dummy-suggestion-type', {
    name: Projection.attr('Name'),
    moderated: Projection.attr('Moderated'),
    parent: Projection.belongsTo('ember-flexberry-dummy-suggestion-type', 'Parent', {
      name: Projection.attr('Name')
    }),
    localizedTypes: Projection.hasMany('ember-flexberry-dummy-localized-suggestion-type', 'Localized types', {
      name: Projection.attr('Name'),
      localization: Projection.belongsTo('ember-flexberry-dummy-localization', 'Localization', {
        name: Projection.attr('Name', { hidden: true })
      }, { displayMemberPath: 'name' })
    })
  });
  modelClass.defineProjection('SuggestionTypeE', 'ember-flexberry-dummy-suggestion-type', {
    name: Projection.attr('Name'),
    moderated: Projection.attr('Moderated'),
    parent: Projection.belongsTo('ember-flexberry-dummy-suggestion-type', 'Parent', {
      name: Projection.attr('Name', { hidden: true })
    }, { displayMemberPath: 'name' }),
    localizedTypes: Projection.hasMany('ember-flexberry-dummy-localized-suggestion-type', 'Localized types', {
      name: Projection.attr('Name'),
      localization: Projection.belongsTo('ember-flexberry-dummy-localization', 'Localization', {
        name: Projection.attr('Name', { hidden: true })
      }, { displayMemberPath: 'name' }),
      suggestionType: Projection.belongsTo('ember-flexberry-dummy-suggestion-type', '', {

      }, { hidden: true })
    })
  });
  modelClass.defineProjection('SuggestionTypeL', 'ember-flexberry-dummy-suggestion-type', {
    name: Projection.attr('Name'),
    moderated: Projection.attr('Moderated'),
    parent: Projection.belongsTo('ember-flexberry-dummy-suggestion-type', 'Parent', {
      name: Projection.attr('Name', { hidden: true })
    }, { displayMemberPath: 'name' })
  });
};
