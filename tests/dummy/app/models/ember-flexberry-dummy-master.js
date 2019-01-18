import { Model as MasterMixin, defineNamespace, defineProjections } from
  '../mixins/regenerated/models/ember-flexberry-dummy-master';
import { Projection } from 'ember-flexberry-data';
import { Offline } from 'ember-flexberry-data';
let Model = Projection.Model.extend(Offline.ModelMixin, MasterMixin, {

});

defineNamespace(Model);
defineProjections(Model);
export default Model;
