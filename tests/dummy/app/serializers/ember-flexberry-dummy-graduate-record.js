import { Serializer as GraduateRecordSerializer } from
  '../mixins/regenerated/serializers/ember-flexberry-dummy-graduate-record';
import StudyRecordSerializer from './ember-flexberry-dummy-study-record';

export default StudyRecordSerializer.extend(GraduateRecordSerializer, {
  /**
  * Field name where object identifier is kept.
  */
  primaryKey: '__PrimaryKey'
});
