/**
 * Created by akulyapin on 09.06.2015.
 */
import Ember from 'ember';

export default Ember.Object.extend({
  noChanges: true,
  anyErrors: false,
  errors: {},

  addError: function (propName, value) {
    this.errors[propName] = value;
  },
  fillErrorsFromProjectedModel: function (model) {
    var _this = this;
    model.eachAttribute(function (name){
      let propErrors = model.errors.get(name);
      if (propErrors.length > 0){
        _this.addError(name, propErrors);
      }
    });
  }
});
