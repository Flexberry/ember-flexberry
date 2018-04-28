import { Model as <%= className %>Mixin<%if (projections) {%>, defineProjections<%}%><%if (parentModelName) {%>, defineBaseModel <%}%> } from
  '../mixins/regenerated/models/<%= name %>';
import <%if(parentModelName) {%><%= parentClassName %>Model from <%= (parentExternal ? "set path to '" : "'./") + parentModelName %>';<%}else{%>EmberFlexberryDataModel from 'ember-flexberry-data/models/model';<%}%>
<%if(!parentModelName) {%>import OfflineModelMixin from 'ember-flexberry-data/mixins/offline-model';<%}%>
let Model = <%if(parentModelName) {%><%= parentClassName %>Model.extend<%}else{%>EmberFlexberryDataModel.extend<%}%>(<%if(!parentModelName) {%>OfflineModelMixin, <%}%><%= className %>Mixin, {

});<%if(parentModelName) {%>
defineBaseModel(Model);<%}%><%if(projections) {%>
defineProjections(Model);<%}%>
export default Model;
