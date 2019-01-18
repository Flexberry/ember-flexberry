import { Model as DetailMixin, defineNamespace, defineProjections } from
  '../mixins/regenerated/models/ember-flexberry-dummy-detail';
import { Projection } from 'ember-flexberry-data';
import { Offline } from 'ember-flexberry-data';
let Model = Projection.Model.extend(Offline.ModelMixin, DetailMixin, {

});

defineNamespace(Model);
defineProjections(Model);
export default Model;
