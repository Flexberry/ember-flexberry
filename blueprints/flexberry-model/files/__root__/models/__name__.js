import DS from 'ember-data';
import <%if(parentModelName) {%><%= parentClassName %>Model from './<%= parentModelName %>';<%}else{%>__BaseModel from './base';<%}%>
<%if(projections) {%>import Proj from 'ember-flexberry-projections';<%}%>
let Model = <%if(parentModelName) {%><%= parentClassName %>Model.extend<%}else{%>__BaseModel.extend<%}%><%= model %>
<%if(projections) {%><%= projections %><%}%>
export default Model;
