import { Model as <%= className %>Mixin<%if (projections) {%>, defineProjections<%}%> } from '../mixins/regenerated/models/<%= name %>';
import <%if(parentModelName) {%><%= parentClassName %>Model from './<%= parentModelName %>';<%}else{%>__BaseModel from 'ember-flexberry-data/models/model';<%}%>
let Model = <%if(parentModelName) {%><%= parentClassName %>Model.extend<%}else{%>__BaseModel.extend<%}%>(<%= className %>Mixin, {

});
<%if(projections) {%>defineProjections(Model);<%}%>
export default Model;
