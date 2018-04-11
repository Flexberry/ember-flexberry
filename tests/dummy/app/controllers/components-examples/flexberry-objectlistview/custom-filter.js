import { computed, observer } from '@ember/object';
import ListFormController from 'ember-flexberry/controllers/list-form';

export default ListFormController.extend({
  filterByAnyWord: false,

  filterByAllWords: false,

  queryParams: ['filterCondition'],
  filterCondition: undefined,

  /**
    Observes current state of FilterCondition parameter
    & set right filter option after reload page.

    @method  _currentFilterCondition
    @private
  */
  _currentFilterCondition: Ember.observer('filterCondition', function() {
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

  customButtons: Ember.computed('filterByAnyWord', 'filterByAllWords', function() {
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
        case 'date': return { name: 'flexberry-datepicker' };
        case 'decimal': return { name: 'flexberry-textbox', properties: { class: 'compact fluid' } };
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
          return ['eq', 'neq', 'like', 'empty'];

        case 'boolean':
          return ['eq'];

        default:
          return ['eq', 'neq'];
      }
    },
  }
});
