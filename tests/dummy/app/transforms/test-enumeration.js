import FlexberryEnum from 'ember-flexberry/transforms/flexberry-enum';
import TransformMap from 'ember-flexberry/utils/transform-map';
import TestEnum from '../enums/test-enumeration';

export default FlexberryEnum.extend({
  transformMap: new TransformMap(TestEnum)
});
