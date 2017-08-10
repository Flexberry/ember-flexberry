import { Model as StudyRecordMixin, defineProjections } from
  '../mixins/regenerated/models/ember-flexberry-dummy-study-record';
import { Projection } from 'ember-flexberry-data';
import { Offline } from 'ember-flexberry-data';
let Model = Projection.Model.extend(Offline.ModelMixin, StudyRecordMixin, {

});
defineProjections(Model);
export default Model;
