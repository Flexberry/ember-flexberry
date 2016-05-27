import FlexberryEnum from 'ember-flexberry/transforms/flexberry-enum';
import <%= className %>Enum from '../enums/<%= name %>';

export default FlexberryEnum.extend({
  enum: <%= className %>Enum
});
