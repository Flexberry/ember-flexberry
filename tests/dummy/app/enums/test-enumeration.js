import Ember from 'ember';

let testEnumeration = Ember.merge(Object.create(null), {
  Value1: 'Enum value №1',
  Value2: 'Enum value №2',
  Value3: 'Enum value №3'
});

export default Object.freeze(testEnumeration);
