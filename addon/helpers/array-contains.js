import Ember from 'ember';

export function arrayContains(params) {
  let array = Ember.A(params[0]);
  let element = params[1];
  if (!Ember.isNone(element)) {
    return array.includes(element);
  }

  return false;
}

export default Ember.Helper.helper(arrayContains);
