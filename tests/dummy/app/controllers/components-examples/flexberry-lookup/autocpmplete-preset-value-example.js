import Ember from 'ember';
import { Query } from 'ember-flexberry-data';
import EditFormController from 'ember-flexberry/controllers/edit-form';

export default EditFormController.extend({

  init() {
    this._super(...arguments);
  },

  actions: {
    onButtonClick: function() { 
      let _this = this;
      let store = this.get('store');
      let builder = new Query.Builder(store).from('ember-flexberry-dummy-suggestion-type')
      .selectByProjection('CustomizeLookupWindowExampleView').top(1);  
      store.query('ember-flexberry-dummy-suggestion-type', builder.build()).then(function(result) {
        let ressutArray = result.toArray();
        _this.set('model.type',ressutArray[0]);
      });
    }
  }
});
