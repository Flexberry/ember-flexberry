/**
  @module ember-flexberry
*/

/**
  Registers some options for 'enum' type (to force application not to instantiate enums).

  @for ApplicationInitializer
  @method flexberryEnum.initialize
  @param {<a href="http://emberjs.com/api/classes/Ember.Application.html">Ember.Application</a>} application Ember application.
*/
export function initialize(application) {
  application.registerOptionsForType('enum', { instantiate: false });
}

export default {
  name: 'flexberry-enum',
  initialize,
};
