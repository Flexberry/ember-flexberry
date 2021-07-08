import ObjectFromEmber from '@ember/object';
import { ObjectMix as <%= className %>Mixin } from
  '../mixins/regenerated/objects/<%= name %>';

let EmberObject = ObjectFromEmber.extend(<%= className %>Mixin, {

});

export default EmberObject;
