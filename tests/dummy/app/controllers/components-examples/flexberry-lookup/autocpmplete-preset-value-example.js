import { Query } from 'ember-flexberry-data';
import EditFormController from 'ember-flexberry/controllers/edit-form';

export default EditFormController.extend({

  init() {
    this._super(...arguments);
  },

  actions: {
    onFillLookupDisplayValueClick: function() { 
      let store = this.get('store');
      let base = store.createRecord('ember-flexberry-dummy-suggestion');
      base.set('type', null);
      base.set('lookupDisplayValue', 'Значение для lookupDisplayValue');
      this.set('model', base);
    },

    onFillLookupDataClick: function() { 
      let store = this.get('store');
      let _this = this;
      let builder = new Query.Builder(store).from('ember-flexberry-dummy-suggestion-type')
      .selectByProjection('CustomizeLookupWindowExampleView').top(1);  
      store.query('ember-flexberry-dummy-suggestion-type', builder.build()).then(function(result) {
        let ressutArray = result.toArray();
        _this.set('model.lookupDisplayValue',ressutArray[0]);
      });
    }
  }
});
