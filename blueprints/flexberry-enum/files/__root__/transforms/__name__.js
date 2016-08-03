import FlexberryEnum from 'ember-flexberry-data/transforms/flexberry-enum';
import <%= className %>Enum from '../enums/<%= name %>';

export default FlexberryEnum.extend({
  enum: <%= className %>Enum
});
