import { ObjectMix as <%= className %>Mixin } from
  '../mixins/regenerated/objects/<%= name %>';

let EmberObject = Ember.Object.extend(<%= className %>Mixin, {

});

export default EmberObject;
