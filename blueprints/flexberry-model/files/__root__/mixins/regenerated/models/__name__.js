import Ember from 'ember';
import DS from 'ember-data';
<%if(projections) {%>import Proj from 'ember-flexberry-data';<%}%>
export let MixinModel = Ember.Mixin.create({
<%= model %>,

});
<%if(projections) {%>export let defineProjections = function (model) {<%}%><%= projections %><%if(projections) {%>};<%}%>
