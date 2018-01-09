import Ember from 'ember';
import ListFormController from 'ember-flexberry/controllers/list-form';

export default ListFormController.extend({
  filterByAnyWord: false,

  filterByAllWords: false,

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
    },

    toggleFilterByAllWords() {
      this.toggleProperty('filterByAllWords');
    },

    componentForFilter(type, relation) {
      switch (type) {
        case 'date': return { name: 'flexberry-datepicker' };
        case 'decimal': return { name: 'flexberry-textbox', properties: { class: 'compact fluid' } };
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
          return ['eq', 'neq', 'like', 'empty'];

        case 'boolean':
          return ['eq'];

        default:
          return ['eq', 'neq'];
      }
    },
  }
});
