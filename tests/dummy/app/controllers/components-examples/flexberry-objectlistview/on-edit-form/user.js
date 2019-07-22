import { inject as service } from '@ember/service';
import { merge } from '@ember/polyfills';
import { computed } from '@ember/object';
import EditFormController from 'ember-flexberry/controllers/edit-form';
import OlvOnEditMixin from 'ember-flexberry/mixins/flexberry-objectlistview-on-edit-form-controller';
import EditFormControllerOperationsIndicationMixin from 'ember-flexberry/mixins/edit-form-controller-operations-indication';
import { StringPredicate, ComplexPredicate } from 'ember-flexberry-data/query/predicate';

export default EditFormController.extend(OlvOnEditMixin, EditFormControllerOperationsIndicationMixin, {
  /**
   Route name for transition after close edit form.

   @property parentRoute
   @type String
   @default 'ember-flexberry-dummy-application-user-list'
  */
  parentRoute: 'components-examples/flexberry-objectlistview/on-edit-form',

  store: service(),

  getCellComponent: null,

  /**
    Name of related to FOLV edit form route.

    @property folvEditFormRoute
    @type String
    @default 'ember-flexberry-dummy-suggestion-type-edit'
   */
  folvEditFormRoute: 'ember-flexberry-dummy-suggestion-type-edit',

  /**
    Name of FOLV model.

    @property folvModelName
    @type String
    @default 'ember-flexberry-dummy-suggestion-type'
   */
  folvModelName: 'ember-flexberry-dummy-suggestion-type',

  /**
    Name of FOLV projection.

    @property folvProjection
    @type String
    @default 'SuggestionTypeL'
   */
  folvProjection: 'SuggestionTypeL',

  objectListViewLimitPredicate: function(options) {
    let methodOptions = merge({
      modelName: undefined,
      projectionName: undefined,
      params: undefined
    }, options);

    if (methodOptions.modelName === this.get('folvModelName') &&
    methodOptions.projectionName === this.get('folvProjection') &&
    !this.get('inHierarchicalMode')) {
      let limitFunction = new ComplexPredicate('or',
        new StringPredicate('name').contains('1'),
        new StringPredicate('name').contains('Type'));
      return limitFunction;
    }

    return undefined;
  },

  /**
    Property to form array of special structures of custom user buttons.

    @property customButtons
    @type Array
   */
  customButtons: computed('i18n.locale', function() {
    let i18n = this.get('i18n');
    return [{
      buttonName: i18n.t('forms.components-examples.flexberry-objectlistview.on-edit-form.add-button-name'),
      buttonAction: 'userButtonAddAction',
      buttonClasses: 'my-add-user-button add-click-button positive'
    }];
  }),

  actions: {
    /**
      Handler for click on custom user button.

      @method userButtonAddAction
     */
    userButtonAddAction: function() {
      let thisUrl = this.get('target.url');
      this.transitionToRoute(this.get('folvEditFormRoute') + '.new')
      .then((newRoute) => {
        newRoute.controller.set('parentRoute', thisUrl);
      });
    },

    /* eslint-disable no-unused-vars */
    componentForFilter(type, relation) {
      switch (type) {
        case 'string': return { name: 'flexberry-textbox', properties: { class: 'compact fluid' } };
        default: return {};
      }
    },
    /* eslint-enable no-unused-vars */

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
