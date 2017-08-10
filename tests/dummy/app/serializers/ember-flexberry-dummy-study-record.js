import { Serializer as StudyRecordSerializer } from
  '../mixins/regenerated/serializers/ember-flexberry-dummy-study-record';
import __ApplicationSerializer from './application';

export default __ApplicationSerializer.extend(StudyRecordSerializer, {
  /**
  * Field name where object identifier is kept.
  */
  primaryKey: '__PrimaryKey'
});
