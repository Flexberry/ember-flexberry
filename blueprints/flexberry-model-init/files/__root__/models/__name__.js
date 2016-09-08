import { Model as <%= className %>Mixin<%if (projections) {%>, defineProjections<%}%> } from '../mixins/regenerated/models/<%= name %>';
import <%if(parentModelName) {%><%= parentClassName %>Model from './<%= parentModelName %>';<%}else{%>__Projection from 'ember-flexberry-data';<%}%>
let Model = <%if(parentModelName) {%><%= parentClassName %>Model.extend<%}else{%>__Projection.Model.extend<%}%>(<%= className %>Mixin, {

});
<%if(projections) {%>defineProjections(Model);<%}%>
export default Model;
