import FlexberryEnumTransormation from 'ember-flexberry-data/transforms/flexberry-enum';
import Enumeration from '../../../../enums/components-examples/flexberry-dropdown/settings-example/enumeration';

export default class extends FlexberryEnumTransormation {
  get enum() {
    return Enumeration;
  }
};
