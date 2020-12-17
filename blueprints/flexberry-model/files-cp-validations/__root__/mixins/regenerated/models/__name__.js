import Ember from 'ember';<%

if (model) { %>
import DS from 'ember-data';<%
}

if (projections) { %>
import { attr, belongsTo, hasMany } from 'ember-flexberry-data/utils/attributes';<%
}

for (let enumName in enumImports) { %>
import <%= enumName %> from '../../../enums/<%= enumImports[enumName] %>';<%
}

if (validations) { %>
import { validator } from 'ember-cp-validations';<%
} %>

export let Model = Ember.Mixin.create({<%= model %>});

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
