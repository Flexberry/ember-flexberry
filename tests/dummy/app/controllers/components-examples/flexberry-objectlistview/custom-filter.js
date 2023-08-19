import { computed, observer } from '@ember/object';
import ListFormController from 'ember-flexberry/controllers/list-form';
import defaultConditionsByType from 'ember-flexberry/utils/default-conditions-by-type';

export default ListFormController.extend({
  filterByAnyWord: false,

  filterByAllWords: false,

  queryParams: ['filterCondition'],
  filterCondition: undefined,

  /**
    Settings for filters with a dropdown list of values.

    @property ddlFilterSettings
    @type Array<Object>
  */
  ddlFilterSettings: computed(function () {
    return [{
      modelName: 'ember-flexberry-dummy-suggestion-type',
      projectionName: 'SuggestionTypeL',
      propName: 'name',
      bindingPath: 'type'
    }]
  }),

  /**
    Observes current state of FilterCondition parameter
    & set right filter option after reload page.

    @method  _currentFilterCondition
    @private
  */
  _currentFilterCondition: observer('filterCondition', function() {
    let filterCondition = this.get('filterCondition');
    if (filterCondition === 'or') {
      this.set('filterByAnyWord', true);
      this.set('filterByAllWords', false);
    }else if (filterCondition === 'and') {
      this.set('filterByAnyWord', false);
      this.set('filterByAllWords', true);
    }

    return filterCondition;
  }),

  customButtons: computed('filterByAnyWord', 'filterByAllWords', function() {
    return [{
      buttonName: 'filterByAnyWord',
      buttonAction: 'toggleFilterByAnyWord',
      buttonClasses: this.get('filterByAnyWord') ? 'positive' : '',
    }, {
      buttonName: 'filterByAllWords',
      buttonAction: 'toggleFilterByAllWords',
      buttonClasses: this.get('filterByAllWords') ? 'positive' : '',
    }];
  }),

  actions: {
    toggleFilterByAnyWord() {
      this.toggleProperty('filterByAnyWord');
      if (this.get('filterByAnyWord')) {
        this.set('filterByAllWords', false);
      }
    },

    toggleFilterByAllWords() {
      this.toggleProperty('filterByAllWords');
      if (this.get('filterByAllWords')) {
        this.set('filterByAnyWord', false);
      }
    },

    /* eslint-disable no-unused-vars */
    componentForFilter(type, relation) {
      switch (type) {
        case 'decimal': return { name: 'flexberry-textbox', properties: { class: 'compact fluid' } };
        default: return {};
      }
    },
    /* eslint-enable no-unused-vars */

    conditionsByType(type, attribute) {
      let i18n = this.get('i18n');
      if (attribute && attribute.name === 'address') {
        return {
          'eq': i18n.t('forms.components-examples.flexberry-objectlistview.custom-filter.eqAddress'),
          'neq': i18n.t('forms.components-examples.flexberry-objectlistview.custom-filter.neqAddress'),
          'like': i18n.t('forms.components-examples.flexberry-objectlistview.custom-filter.likeAddress'),
          'nlike': i18n.t('forms.components-examples.flexberry-objectlistview.custom-filter.nlikeAddress'),
        };
      }

      if (type === 'string') {
        return ['eq', 'neq', 'like', 'empty'];
      }

      return defaultConditionsByType(type, i18n);      
    },
  }
});
