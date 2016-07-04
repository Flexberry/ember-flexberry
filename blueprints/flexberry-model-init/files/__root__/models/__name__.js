import DS from 'ember-data';
import <%= className %>Mixin from '../mixins/regenerated/models/<%= name %>';
import <%if(parentModelName) {%><%= parentClassName %>Model from './<%= parentModelName %>';<%}else{%>__BaseModel from './base';<%}%>
let Model = <%if(parentModelName) {%><%= parentClassName %>Model.extend<%}else{%>__BaseModel.extend<%}%>(<%= className %>Mixin, {
});
export default Model;
