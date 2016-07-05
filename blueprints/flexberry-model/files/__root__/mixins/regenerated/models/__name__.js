import Ember from 'ember';
import DS from 'ember-data';
<%if(projections) {%>import Proj from 'ember-flexberry-data';<%}%>
let MixinModel = Ember.Mixin.create({
  init: function () {
    this._super(...arguments);
    this.defineProjections();
  },
<%= model %>,
  defineProjections: function() {
<%= projections %>
  }
});

export default MixinModel;
