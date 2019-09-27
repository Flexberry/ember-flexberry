import { isNone } from '@ember/utils';
import { merge } from '@ember/polyfills';
import { observer } from '@ember/object';
import { scheduleOnce } from '@ember/runloop';
import BaseEditFormController from 'ember-flexberry/controllers/edit-form';
import EditFormControllerOperationsIndicationMixin from 'ember-flexberry/mixins/edit-form-controller-operations-indication';
import OlvOnEditMixin from 'ember-flexberry/mixins/flexberry-objectlistview-on-edit-form-controller';

import { Query } from 'ember-flexberry-data';

export default BaseEditFormController.extend(OlvOnEditMixin, EditFormControllerOperationsIndicationMixin, {
  /**
    Route name for transition after close edit form.

    @property parentRoute
    @type String
    @default 'ember-flexberry-dummy-suggestion-list'
   */
  parentRoute: 'components-examples/flexberry-objectlistview/on-edit-form',

  /**
    Name of model.comments edit route.

    @property commentsEditRoute
    @type String
    @default 'ember-flexberry-dummy-comment-edit'
   */
  commentsEditRoute: 'ember-flexberry-dummy-comment-edit',

  folvModelName: 'ember-flexberry-dummy-localized-suggestion-type',
  folvProjection: 'LocalizedSuggestionTypeE',

  /**
    Method to get type and attributes of a component,
    which will be embeded in object-list-view cell.

    @method getCellComponent.
    @param {Object} attr Attribute of projection property related to current table cell.
    @param {String} bindingPath Path to model property related to current table cell.
    @param {DS.Model} modelClass Model class of data record related to current table row.
    @return {Object} Object containing name & properties of component, which will be used to render current table cell.
    { componentName: 'my-component',  componentProperties: { ... } }.
   */
  getCellComponent(attr, bindingPath, model) {
    let cellComponent = this._super(...arguments);
    if (isNone(model)) {
      return cellComponent;
    }

    if (attr.kind === 'belongsTo') {
      switch (`${model.modelName}+${bindingPath}`) {
        case 'ember-flexberry-dummy-vote+author':
          cellComponent.componentProperties = {
            choose: 'showLookupDialog',
            remove: 'removeLookupValue',
            displayAttributeName: 'name',
            required: true,
            relationName: 'author',
            projection: 'ApplicationUserL',
            autocomplete: true,
          };
          break;

        case 'ember-flexberry-dummy-comment+author':
          cellComponent.componentProperties = {
            choose: 'showLookupDialog',
            remove: 'removeLookupValue',
            displayAttributeName: 'name',
            required: true,
            relationName: 'author',
            projection: 'ApplicationUserL',
            autocomplete: true,
          };
          break;

      }
    } else if (attr.kind === 'attr') {
      switch (`${model.modelName}+${bindingPath}`) {
        case 'ember-flexberry-dummy-vote+author.eMail':
          cellComponent.componentProperties = {
            readonly: true,
          };
      }
    }

    return cellComponent;
  },

  objectListViewLimitPredicate: function(options) {
    let methodOptions = merge({
      modelName: undefined,
      projectionName: undefined,
      params: undefined
    }, options);

    if (methodOptions.modelName === this.get('folvModelName') &&
    methodOptions.projectionName === this.get('folvProjection')) {
      let id =  this.get('model.type.id');
      let limitFunction = new Query.SimplePredicate('suggestionType', Query.FilterOperator.Eq, id);
      return limitFunction;
    }

    return undefined;
  },

  customFolvContentObserver: observer('model', 'model.type', 'perPage', 'page', 'sorting', 'filter', 'filters', function() {
    scheduleOnce('afterRender', this, this.getCustomContent);
  }),
});
