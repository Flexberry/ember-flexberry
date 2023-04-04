import Mixin from '@ember/object/mixin';
import $ from 'jquery';<%
if (model) { %>
import DS from 'ember-data';<%
}

if (validations) { %>
import { validator } from 'ember-cp-validations';<%
}

if (projections) { %>
import { attr, belongsTo, hasMany } from 'ember-flexberry-data/utils/attributes';<%
}

for (let enumName in enumImports) { %>
import <%= enumName %> from '../../../enums/<%= enumImports[enumName] %>';<%
} %>

export let Model = Mixin.create({<%= model %>});

export let ValidationRules = {<%= validations %>};<%

if (parentModelName) { %>

export let defineBaseModel = function (modelClass) {
  modelClass.reopenClass({
    _parentModelName: '<%= parentModelName %>'
  });
};<%
}

if (projections) { %>

export let defineProjections = function (modelClass) {<%= projections %>};<%
} %>
