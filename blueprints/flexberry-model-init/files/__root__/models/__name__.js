import { Model as <%= className %>Mixin<%if (projections) {%>, defineProjections<%}%> } from '../mixins/regenerated/models/<%= name %>';
import <%if(parentModelName) {%><%= parentClassName %>Model from './<%= parentModelName %>';<%}else{%>{ Projection } from 'ember-flexberry-data';<%}%>
let Model = <%if(parentModelName) {%><%= parentClassName %>Model.extend<%}else{%>Projection.Model.extend<%}%>(<%= className %>Mixin, {

});
<%if(parentModelName) {%>Model.reopenClass({ _parentModelName: '<%= parentModelName %>' });<%}%>
<%if(projections) {%>defineProjections(Model);<%}%>
export default Model;
