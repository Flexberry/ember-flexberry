import Ember from 'ember';

export let Serializer = Ember.Mixin.create({
  attrs: {
<%= serializerAttrs %>
  },
  /**
  * Field name where object identifier is kept.
  */
  primaryKey: '__PrimaryKey'
});
