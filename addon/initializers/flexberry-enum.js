export function initialize(application) {
  application.registerOptionsForType('enum', { instantiate: false });
}

export default {
  name: 'flexberry-enum',
  initialize
};
