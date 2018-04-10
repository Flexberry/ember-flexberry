/**
  @module ember-flexberry
*/

import EmberObject from '@ember/object';

/**
  Class for object describing properties of the
  {{#crossLink "FlexberryTreenodeComponent"}}flexberry-treenode component{{/crossLink}}.
  All class properties are related to the same component's properties.

  @class TreeNodeObject
  @extends <a href="http://emberjs.com/api/classes/Ember.Object.html">Ember.Object</a>
*/
export default EmberObject.extend({
  /**
    Tree node's caption.

    @property caption
    @type String
    @default null
  */
  caption: null,

  /**
    Component's dynamic actions.
    Related to component's property inherited from
    {{#crossLink "DynamicActionsMixin/dynamicActions:property"}}dynamic-actions mixin{{/crossLink}}.

    @property dynamicActions
    @type DynamicActionObject[]
    @default null
  */
  dynamicActions: null,

  /**
    Child nodes.

    @property nodes
    @type TreeNodeObject[]
    @default null
  */
  nodes: null
});
