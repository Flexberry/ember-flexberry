import Mixin from '@ember/object/mixin';
import $ from 'jquery';
import DS from 'ember-data';
<%if(projections) {%>import { attr, belongsTo, hasMany } from 'ember-flexberry-data/utils/attributes';<%}%>
export let Model = Mixin.create({
<%= model %>
});<%if(parentModelName) {%>
export let defineBaseModel = function (modelClass) {
  modelClass.reopenClass({
    _parentModelName: '<%= parentModelName %>'
  });
};
<%}%>
<%if(projections) {%>export let defineProjections = function (modelClass) {<%}%><%= projections %><%if(projections) {%>};
<%}%>
