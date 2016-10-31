import EditFormController from 'ember-flexberry/controllers/edit-form';
import { Query } from 'ember-flexberry-data';

const { StringPredicate } = Query;

export default EditFormController.extend({

  dynamicProperties: undefined,

 actions: {

    firstLimitFunction() {
      let currentLookupValue = '234';
      let per = new StringPredicate('name').contains(currentLookupValue);
      this.set('dynamicProperties.lookupLimitPredicate', per);
    },

    secondLimitFunction() {
      let currentLookupValue = 'ыыыыы';
      let per = new StringPredicate('name').contains(currentLookupValue);
      this.set('dynamicProperties.lookupLimitPredicate', per);
    },

    clearLimitFunction() {
      this.set('dynamicProperties.lookupLimitPredicate', undefined);
    }
  },

  init(){
    this._super(...arguments);
    this.set('dynamicProperties', 
    {
      lookupLimitPredicate: null
    });
  }
});
