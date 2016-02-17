import Ember from 'ember';
import ListFormController from './list-form';

export default ListFormController.extend({
  /**
   * Current function to limit accessible values of model.
   *
   * @property flexberryOlvLimitFunction
   * @type String
   * @default undefined
   */
  flexberryOlvLimitFunction: Ember.computed('perPageValue', function() {
    let currentPerPageValue = this.get('perPageValue');
    if (currentPerPageValue % 2 === 0) {
      return 'FirstName ge \'N\'';
    }

    return 'FirstName lt \'N\'';
  })
});
