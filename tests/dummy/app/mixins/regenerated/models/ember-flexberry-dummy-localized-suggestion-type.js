import Ember from 'ember';
import DS from 'ember-data';
import { Projection } from 'ember-flexberry-data';
export let Model = Ember.Mixin.create({
  createTime: DS.attr('date'),
  creator: DS.attr('string'),
  editTime: DS.attr('date'),
  editor: DS.attr('string'),
  name: DS.attr('string'),
  /**
    Non-stored property.

    @property detailComputedField
  */
  detailComputedField: DS.attr('string'),
  /**
    Method to set non-stored property.
    Please, use code below in model class (outside of this mixin) otherwise it will be replaced during regeneration of models.
    Please, implement 'detailComputedFieldCompute' method in model class (outside of this mixin) if you want to compute value of 'detailComputedField' property.

    @method _detailComputedFieldCompute
    @private
    @example
      ```javascript
      _detailComputedFieldChanged: Ember.on('init', Ember.observer('detailComputedField', function() {
        Ember.run.once(this, '_detailComputedFieldCompute');
      }))
      ```
  */
  _detailComputedFieldCompute: function() {
    let result = (this.detailComputedFieldCompute && typeof this.detailComputedFieldCompute === 'function') ? this.detailComputedFieldCompute() : null;
    this.set('detailComputedField', result);
  },
  localization: DS.belongsTo('ember-flexberry-dummy-localization', { inverse: null, async: false }),
  suggestionType: DS.belongsTo('ember-flexberry-dummy-suggestion-type', { inverse: 'localizedTypes', async: false }),
  getValidations: function () {
    let parentValidations = this._super();
    let thisValidations = {
      name: { presence: true },
      localization: { presence: true },
      suggestionType: { presence: true }
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
  modelClass.defineProjection('AuditView', 'ember-flexberry-dummy-localized-suggestion-type', {
    name: Projection.attr('Name', { index: 0 }),
    localization: Projection.belongsTo('ember-flexberry-dummy-localization', 'Localization', {
      name: Projection.attr('Name', { index: 2, hidden: true })
    }, { index: 1, displayMemberPath: 'name' })
  });
  modelClass.defineProjection('LocalizedSuggestionTypeE', 'ember-flexberry-dummy-localized-suggestion-type', {
    name: Projection.attr('Name', { index: 0 }),
    localization: Projection.belongsTo('ember-flexberry-dummy-localization', 'Localization', {
      name: Projection.attr('Name', { index: 2, hidden: true })
    }, { index: 1, displayMemberPath: 'name' }),
    suggestionType: Projection.belongsTo('ember-flexberry-dummy-suggestion-type', '', {

    }, { index: 3, hidden: true })
  });
  modelClass.defineProjection('LocalizedSuggestionTypeEWithComputedField', 'ember-flexberry-dummy-localized-suggestion-type', {
    name: Projection.attr('', { index: 0 }),
    detailComputedField: Projection.attr('', { index: 1 }),
    localization: Projection.belongsTo('ember-flexberry-dummy-localization', '', {
      name: Projection.attr('', { index: 3 })
    }, { index: 2 }),
    suggestionType: Projection.belongsTo('ember-flexberry-dummy-suggestion-type', '', {

    }, { index: 4 })
  });
};
