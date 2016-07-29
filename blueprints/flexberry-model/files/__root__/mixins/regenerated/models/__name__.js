import Ember from 'ember';
import DS from 'ember-data';
<%if(projections) {%>import { Projection } from 'ember-flexberry-data';<%}%>
export let Model = Ember.Mixin.create({
<%= model %>,

});
<%if(projections) {%>export let defineProjections = function (model) {<%}%><%= projections %><%if(projections) {%>};<%}%>
