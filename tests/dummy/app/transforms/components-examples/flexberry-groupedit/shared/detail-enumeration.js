import FlexberryEnumTransormation from 'ember-flexberry-data/transforms/flexberry-enum';
import DetailEnumeration from '../../../../enums/components-examples/flexberry-groupedit/shared/detail-enumeration';

export default class extends FlexberryEnumTransormation {
  get enum() {
    return DetailEnumeration;
  }
};
