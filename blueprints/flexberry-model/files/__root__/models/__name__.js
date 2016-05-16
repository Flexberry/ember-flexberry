import DS from 'ember-data';
import <%if(parentModelName) {%><%= parentClasslName %>Model from './<%= parentModelName %>';<%}else{%>__BaseModel from './base';<%}%>
import Proj from 'ember-flexberry-projections';

let Model = <%if(parentModelName) {%><%= parentClasslName %>Model.extend<%}else{%>__BaseModel.extend<%}%><%= model %>

<%= projections %>

export default Model;
