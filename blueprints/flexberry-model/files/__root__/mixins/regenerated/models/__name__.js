import Ember from 'ember';
import DS from 'ember-data';
<%if(projections) {%>import Proj from 'ember-flexberry-data';<%}%>
let MixinModel = Ember.Mixin.create<%= model %>
<%if(projections) {%><%= projections %><%}%>
export default MixinModel;
