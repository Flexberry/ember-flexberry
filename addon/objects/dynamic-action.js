/**
  @module ember-flexberry
*/

import EmberObject from '@ember/object';

/**
  Class for object describing dynamic action, which can be binded to component,
  consuming it's inner structure as [JSON-object](http://www.json.org/)
  or [Ember-object](https://emberjs.com/api/ember/release/classes/EmberObject), if component
  uses {{#crossLink "DynamicActionsMixin"}}dynamic-actions mixin{{/crossLink}}.

  @class DynamicActionObject
  @extends <a href="https://emberjs.com/api/ember/release/classes/EmberObject">EmberObject</a>
*/
export default EmberObject.extend({
  /**
    Name of component's action which will play a trigger role
    for the specified {{#crossLink "DynamicActionObject/actionHandler:property"}}handler{{/crossLink}},
    or/and for {{#crossLink "DynamicActionObject/actionContext:property"}given context's{{/crossLink}}
    action with the {{#crossLink "DynamicActionObject/actionName:property"}specified name{{/crossLink}}.

    @property on
    @type String
    @default null
  */
  on: null,

  /**
    Handler (callback) for the component's action specified in
    {{#crossLink "DynamicActionObject/on:property"}}'on'{{/crossLink}} property.
    Will be called with {{#crossLink "DynamicActionObject/actionContext:property"}given context{{/crossLink}}
    (if context is defined).

    @property actionHandler
    @type Function
    @default null
  */
  actionHandler: null,

  /**
    Name of the action existing in {{#crossLink "DynamicActionObject/actionContext:property"}given context{{/crossLink}}
    which will be triggered when component sent it's action specified in
    {{#crossLink "DynamicActionObject/on:property"}}'on'{{/crossLink}} property.

    @property actionName
    @type String
    @default null
  */
  actionName: null,

  /**
    Action handler's context.
    Will be used as a context for the
    {{#crossLink "DynamicActionObject/actionHandler:property"}}given action handler{{/crossLink}},
    and as an owner for action with the
    {{#crossLink "DynamicActionObject/actionName:property"}specified name{{/crossLink}}.

    @property actionContext
    @type Object
    @default null
  */
  actionContext: null,

  /**
    Additional arguments which will be added in the beginning of arguments array
    of {{#crossLink "DynamicActionObject/actionHandler:property"}}given action handler{{/crossLink}},
    and in the beginning of arguments array of action with the
    {{#crossLink "DynamicActionObject/actionName:property"}specified name{{/crossLink}}.

    @property actionArguments
    @type any[]
    @default null
  */
  actionArguments: null
});
