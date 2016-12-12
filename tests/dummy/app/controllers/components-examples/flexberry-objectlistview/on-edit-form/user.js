import Ember from 'ember';
import EditFormController from 'ember-flexberry/controllers/edit-form';
import EditFormControllerOperationsIndicationMixin from '../../../../mixins/edit-form-controller-operations-indication';
import { StringPredicate, ComplexPredicate } from 'ember-flexberry-data/query/predicate';

export default EditFormController.extend(EditFormControllerOperationsIndicationMixin, {
  /**
   Route name for transition after close edit form.

   @property parentRoute
   @type String
   @default 'ember-flexberry-dummy-application-user-list'
  */
  parentRoute: 'components-examples/flexberry-objectlistview/on-edit-form',

  store: Ember.inject.service(),

  getCellComponent: null,

  /**
    Name of related to FOLV edit form route.

    @property folvEditFormRoute
    @type String
    @default 'ember-flexberry-dummy-localization-edit'
   */
  folvEditFormRoute: 'ember-flexberry-dummy-localization-edit',

  /**
    Name of FOLV model.

    @property folvModelName
    @type String
    @default 'ember-flexberry-dummy-localization'
   */
  folvModelName: 'ember-flexberry-dummy-localization',

  /**
    Name of FOLV projection.

    @property folvProjection
    @type String
    @default 'LocalizationL'
   */
  folvProjection: 'LocalizationL',

  objectListViewLimitPredicate: function(options) {
    let methodOptions = Ember.merge({
      modelName: undefined,
      projectionName: undefined,
      params: undefined
    }, options);

    if (methodOptions.modelName === this.get('folvModelName') &&
    methodOptions.projectionName === this.get('folvProjection')) {
      let limitFunction = new ComplexPredicate('or',
        new StringPredicate('name').contains('1'),
        new StringPredicate('name').contains('Тест'));
      return limitFunction;
    }

    return undefined;
  },

  actions: {
    componentForFilter(type, relation) {
      switch (type) {
        case 'string': return { name: 'flexberry-textbox', properties: { class: 'compact fluid' } };
        default: return {};
      }
    },

    conditionsByType(type) {
      switch (type) {
        case 'file':
          return null;

        case 'date':
        case 'number':
          return ['eq', 'neq', 'le', 'ge'];

        case 'string':
          return ['eq', 'neq', 'like'];

        case 'boolean':
          return ['eq'];

        default:
          return ['eq', 'neq'];
      }
    },
  },

});
