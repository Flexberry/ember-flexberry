import Ember from 'ember';
import { Query } from 'ember-flexberry-data';
import EditFormController from 'ember-flexberry/controllers/edit-form';

export default EditFormController.extend({

  init() {
    this._super(...arguments);
  },

  actions: {
    onButtonClick: function() { 
      //this.set('model.lookupDisplayValue', 'Значение для lookupDisplayValue');
      /*let store = this.get('store');
      let builder = new Query.Builder(store).from('ember-flexberry-dummy-suggestion-type')
      .selectByProjection('CustomizeLookupWindowExampleView').top(1);  
      store.query('ember-flexberry-dummy-suggestion-type', builder.build()).then(function(result) {
        let ressutArray = result.toArray();
        _this.set('model.lookupDisplayValue',ressutArray[0]);
      });*/
      let store = this.get('store');
      let base = store.createRecord('ember-flexberry-dummy-suggestion');
      base.set('lookupDisplayValue', 'Значение для lookupDisplayValue');
      this.set('model', base);
    }
  }

  /*model() {
    let store = this.get('store');
    let base = store.createRecord('ember-flexberry-dummy-suggestion');
    return base;
  }*/
});
