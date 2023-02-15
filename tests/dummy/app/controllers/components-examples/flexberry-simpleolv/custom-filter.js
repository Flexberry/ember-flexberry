import Ember from 'ember';
import ListFormController from 'ember-flexberry/controllers/list-form';
import generateUniqueId from 'ember-flexberry-data/utils/generate-unique-id';

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

  customButtons: Ember.computed('filterByAnyWord', 'filterByAllWords', 'i18n.locale', function() {
    let i18n = this.get('i18n');
    return [{
      buttonName: 'filterByAnyWord',
      buttonAction: 'toggleFilterByAnyWord',
      buttonClasses: this.get('filterByAnyWord') ? 'positive' : '',
    }, {
      buttonName: 'filterByAllWords',
      buttonAction: 'toggleFilterByAllWords',
      buttonClasses: this.get('filterByAllWords') ? 'positive' : '',
    }, {
      buttonName: i18n.t('forms.components-examples.flexberry-simpleolv.custom-filter.addObjects-button'),
      buttonAction: 'addObjects'
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

    addObjects() {
      let store = this.get('store');

      let user1 = store.createRecord('ember-flexberry-dummy-application-user', {
        name: 'NameForTest',
        eMail: 'ya@.test',
        id: generateUniqueId()
      });
      let type1 = store.createRecord('ember-flexberry-dummy-suggestion-type', {
        name: 'typeForTest',
        id: generateUniqueId()
      });
      let user2 = store.createRecord('ember-flexberry-dummy-application-user', {
        name: 'Different NameForTest',
        eMail: 'ti@.test',
        id: generateUniqueId()
      });
      let type2 = store.createRecord('ember-flexberry-dummy-suggestion-type', {
        name: 'Another typeForTest',
        id: generateUniqueId()
      });

      let record1 = store.createRecord(this.get('modelName'), {
        address: 'TestingAddress',
        type: type1,
        author: user1,
        editor1: user2,
        id: generateUniqueId()
      });
      let record2 = store.createRecord(this.get('modelName'), {
        address: '',
        type: type1,
        author: user2,
        editor1: user2,
        id: generateUniqueId()
      });
      let record3 = store.createRecord(this.get('modelName'), {
        address: 'new address',
        type: type2,
        author: user1,
        editor1: user1,
        id: generateUniqueId()
      });
      let record4 = store.createRecord(this.get('modelName'), {
        address: 'address with several words for testing',
        type: type2,
        author: user2,
        editor1: user1,
        id: generateUniqueId()
      });

      store.batchUpdate([user1, type1, user2, type2, record1, record2, record3, record4]).then(() => {
        this.send('refreshList', this.get('componentName'));
      });
    },

    componentForFilter(type, relation) {
      switch (type) {
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
