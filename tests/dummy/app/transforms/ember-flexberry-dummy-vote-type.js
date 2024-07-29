import FlexberryEnum from 'ember-flexberry-data/transforms/flexberry-enum';
import VoteTypeEnum from '../enums/ember-flexberry-dummy-vote-type';

export default class extends FlexberryEnum {
  get enum() {
    return VoteTypeEnum;
  }
};
