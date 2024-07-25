import Model, { attr } from '@ember-data/model';

export default class EmberFlexberryDummyApplicationUserModel extends Model {
  @attr('string') name;
  @attr('string') eMail;
  @attr('string') phone1;
  @attr('string') phone2;
  @attr('string') phone3;
  @attr('boolean') activated;
  @attr('boolean') vip;
  @attr('date') birthday;
  @attr('number') karma;
}
