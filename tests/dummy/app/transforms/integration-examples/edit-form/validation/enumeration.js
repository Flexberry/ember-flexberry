import FlexberryEnumTransormation from 'ember-flexberry-data/transforms/flexberry-enum';
import Enumeration from '../../../../enums/integration-examples/edit-form/validation/enumeration';

export default class extends FlexberryEnumTransormation {
  get enum() {
    return Enumeration;
  }
};
