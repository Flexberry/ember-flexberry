/**
  @module ember-flexberry
*/

import EmberObject from '@ember/object';

/**
  Class for object describing properties of the
  {{#crossLink "FlexberryTreenodeComponent"}}flexberry-treenode component{{/crossLink}}.
  All class properties are related to the same component's properties.

  @class TreeNodeObject
  @extends <a href="https://emberjs.com/api/ember/release/classes/EmberObject">EmberObject</a>
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
