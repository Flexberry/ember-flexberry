import ListFormController from 'ember-flexberry/controllers/list-form';

export default ListFormController.extend({
  actions: {
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
          return ['eq', 'neq', 'like'];

        case 'boolean':
          return ['eq'];

        default:
          return ['eq', 'neq'];
      }
    },
  }
});
