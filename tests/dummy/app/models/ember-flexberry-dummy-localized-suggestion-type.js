import Ember from 'ember';
import { Model as LocalizedSuggestionTypeMixin, defineNamespace, defineProjections } from
  '../mixins/regenerated/models/ember-flexberry-dummy-localized-suggestion-type';
import { Projection } from 'ember-flexberry-data';
import { Offline } from 'ember-flexberry-data';
let Model = Projection.Model.extend(Offline.ModelMixin, LocalizedSuggestionTypeMixin, {
  detailComputedFieldCompute: function() {
    let name = this.get('name');
    let localizationName = this.get('localization.name');
    let result = (localizationName) ? name + ':' + localizationName : name;
    this.set('detailComputedField', result);
  },

  detailComputedFieldChanged: Ember.on('init', Ember.observer('name', function() {
    Ember.run.once(this, 'detailComputedFieldCompute');
  })),

  localizationChanged: Ember.on('init', Ember.observer('localization', function() {
    Ember.run.once(this, 'detailComputedFieldCompute');
  })),
});

defineNamespace(Model);
defineProjections(Model);
export default Model;
