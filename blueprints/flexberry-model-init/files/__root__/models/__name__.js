import { Model as <%= className %>Mixin<%if (namespace) {%>, defineNamespace<%}%><%if (projections) {%>, defineProjections<%}%><%if (parentModelName) {%>, defineBaseModel <%}%> } from
  '../mixins/regenerated/models/<%= name %>';
import <%if(parentModelName) {%><%= parentClassName %>Model from <%= (parentExternal ? "set path to '" : "'./") + parentModelName %>';<%}else{%>{ Projection } from 'ember-flexberry-data';<%}%>
<%if(!parentModelName) {%>import { Offline } from 'ember-flexberry-data';<%}%>
let Model = <%if(parentModelName) {%><%= parentClassName %>Model.extend<%}else{%>Projection.Model.extend<%}%>(<%if(!parentModelName) {%>Offline.ModelMixin, <%}%><%= className %>Mixin, {

});
<%if(namespace) {%>
defineNamespace(Model);<%}%><%if(parentModelName) {%>
defineBaseModel(Model);<%}%><%if(projections) {%>
defineProjections(Model);<%}%>
export default Model;
