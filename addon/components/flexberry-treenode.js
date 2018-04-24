/**
  @module ember-flexberry
*/

import $ from 'jquery';
import Component from '@ember/component';
import { computed, observer } from '@ember/object';
import { isArray } from '@ember/array';
import { isNone } from '@ember/utils';
import SlotsMixin from 'ember-block-slots';
import RequiredActionsMixin from '../mixins/required-actions';
import DomActionsMixin from '../mixins/dom-actions';
import DynamicActionsMixin from '../mixins/dynamic-actions';
import DynamicPropertiesMixin from '../mixins/dynamic-properties';

/**
  Component's CSS-classes names.
  JSON-object containing string constants with CSS-classes names related to component's hbs-markup elements.

  @property {Object} flexberryClassNames
  @property {String} flexberryClassNames.prefix Component's CSS-class names prefix ('flexberry-treenode').
  @property {String} flexberryClassNames.wrapper Component's wrapping <div> CSS-class name ('flexberry-treenode').
  @property {String} flexberryClassNames.header Component's header <div> CSS-class name ('flexberry-treenode-header').
  @property {String} flexberryClassNames.content Component's content <div> CSS-class name ('flexberry-treenode-content').
  @property {String} flexberryClassNames.expandCollapseIcon Component's expand/collapse icon CSS-class name ('flexberry-treenode-expand-collapse-icon').
  @property {String} flexberryClassNames.preventExpandCollapse Component's CSS-class name to prevent nodes expand/collapse animation ('flexberry-treenode-prevent-expand-collapse').
  @readonly
  @static

  @for FlexberryTreenodeComponent
*/
const flexberryClassNamesPrefix = 'flexberry-treenode';
const flexberryClassNames = {
  prefix: flexberryClassNamesPrefix,
  wrapper: flexberryClassNamesPrefix,
  header: flexberryClassNamesPrefix + '-header',
  content: flexberryClassNamesPrefix + '-content',
  expandCollapseIcon: flexberryClassNamesPrefix + '-expand-collapse-icon',
  preventExpandCollapse: flexberryClassNamesPrefix + '-prevent-expand-collapse'
};

/**
  Flexberry tree node component with [Semantic UI accordion](http://semantic-ui.com/modules/accordion.html) style.
  Component must be used in combination with {{#crossLink "FlexberryTreeComponent"}}flexberry-tree component{{/crossLink}}
  as a wrapper for those tree nodes, which are placed on the same tree level.

  Usage:
  templates/my-form.hbs
  ```handlebars
  {{#flexberry-tree exclusive=false}}
    {{#flexberry-treenode caption="Node 1 (with child nodes)"}}
      Node 1 custom content

      {{#flexberry-tree}}
        {{flexberry-treenode caption="Node 1.1 (leaf node)"}}

        {{#flexberry-treenode caption="Node 1.2 (with child nodes)"}}
          Node 1.2 custom content

          {{#flexberry-tree}}
            {{#flexberry-treenode caption="Node 1.2.1 (with child nodes)"}}
              Node 1.2.1 custom content

              {{#flexberry-tree}}
                {{flexberry-treenode caption="Node 1.2.1.1 (leaf node)"}}
              {{/flexberry-tree}}
            {{/flexberry-treenode}}

            {{flexberry-treenode caption="Node 1.2.2 (leaf node)"}}
          {{/flexberry-tree}}
        {{/flexberry-treenode}}
      {{/flexberry-tree}}
    {{/flexberry-treenode}}

    {{flexberry-treenode caption="Node 2 (leaf node)"}}
  {{/flexberry-tree}}
  ```

  @class FlexberryTreenodeComponent
  @extends <a href="http://emberjs.com/api/classes/Ember.Component.html">Ember.Component</a>
  @uses <a href="https://github.com/ciena-blueplanet/ember-block-slots#usage">SlotsMixin</a>
  @uses RequiredActionsMixin
  @uses DomActionsMixin
  @uses DynamicActionsMixin
  @uses DynamicPropertiesMixin
*/
let FlexberryTreenodeComponent = Component.extend(
  SlotsMixin,
  RequiredActionsMixin,
  DomActionsMixin,
  DynamicActionsMixin,
  DynamicPropertiesMixin, {

    /**
      Flag: indicates whether some {{#crossLink "FlexberryTreenodeComponent/nodes:property"}}tree 'nodes'{{/childNodes}} are defined.

      @property _hasNodes
      @type boolean
      @readOnly
      @private
    */
    _hasNodes: computed('nodes.[]', function() {
      let nodes = this.get('nodes');

      return isArray(nodes) && nodes.length > 0;
    }),

    /**
      Flag: indicates whether some nested content is defined
      (some yield markup or {{#crossLink "FlexberryTreenodeComponent/nodes:property"}}'nodes'{{/childNodes}} are defined).

      @property _hasContent
      @type boolean
      @readOnly
      @private
    */
    _hasContent: computed('_slots.[]', '_hasNodes', function() {
      // Yielded {{block-slot "content"}} is defined or 'nodes' are defined.
      return this._isRegistered('content') || this.get('_hasNodes');
    }),

    /**
      Reference to component's CSS-classes names.
      Must be also a component's instance property to be available from component's hbs-markup.
    */
    flexberryClassNames,

    /**
      Component's wrapping <div> CSS-classes names.

      Any other CSS-class names can be added through component's 'class' property.
      ```handlebars
      {{#flexberry-treenode class="styled"}}
        Tree's content
      {{/flexberry-treenode}}
      ```

      @property classNames
      @type String[]
      @default ['flexberry-treenode']
    */
    classNames: [flexberryClassNames.wrapper],

    /**
      Tree node's caption (will be displayed in node's header).

      @property caption
      @type String
      @default null
    */
    caption: null,

    /**
      Child nodes.
      This property is optional and must be used when there are too many child nodes,
      and you don't want to define them explicitly in the .hbs markup,
      then you can define nodes array somewhere in code & pass defined array to this component's property.

      @property nodes
      @type FlexberryTreenodeObject[]
      @default null
    */
    nodes: null,

    actions: {
      /**
        Handles tree node header's 'click' event.
        Prevents 'click' event from bubbling for leaf nodes.
        Invokes component's {{#crossLink "FlexberryTreenodeComponent/sendingActions.headerClick:method"}}'headerClick'{{/crossLink}} action.
        Invokes component's {{#crossLink "FlexberryTreenodeComponent/sendingActions.beforeExpand:method"}}'beforeExpand'{{/crossLink}} action.
        Invokes component's {{#crossLink "FlexberryTreenodeComponent/sendingActions.beforeCollapse:method"}}'beforeCollapse'{{/crossLink}} action.

        @method actions.onHeaderClick
        @param {Object} [jQuery event object](http://api.jquery.com/category/events/event-object/)
        which describes Inner header element's 'click' event.
      */
      onHeaderClick(e) {
        // Send 'headerClick' action anyway.
        this.get('headerClick')({
          originalEvent: e
        });

        // As the 'click' event-target here could be passed any inner element nested inside node's header
        // (even some inner elements of dynamic components nested inside node),
        // that's why we should check for a special class-name in event-target itself & in it's parent elements.
        let $clickTarget = $(e.target);
        let clickTargetShouldPreventExpandCollapse = $clickTarget.hasClass(flexberryClassNames.preventExpandCollapse);
        if (!clickTargetShouldPreventExpandCollapse)  {
          clickTargetShouldPreventExpandCollapse = $clickTarget.parents().hasClass(flexberryClassNames.preventExpandCollapse);
        }

        // Prevent node header's click event from bubbling to disable expand/collapse animation in the following situations:
        // if click event-target is element containing special class-name preventing node from expanding/collapsing,
        // if node is leaf (node without nested content).
        if (clickTargetShouldPreventExpandCollapse || !this.get('_hasContent')) {
          e.stopPropagation();

          return;
        }

        let expandedNodeClassName = $.fn.accordion.settings.className.active;
        if ($(e.currentTarget).hasClass(expandedNodeClassName)) {
          this.get('beforeCollapse')({
            originalEvent: e
          });
        } else {
          this.get('beforeExpand')({
            originalEvent: e
          });
        }
      }
    },

    /**
      Observes changes in {{#crossLink "FlexberryTreenodeComponent/_hasNodes:property"}}'_hasContent' flag{{/crossLink}},
      and collapses node if '_hasContent' became false.

      @method _hasContentDidChange
      @private
    */
    _hasContentDidChange: observer('_hasContent', function() {
      if (this.get('_hasContent')) {
        return;
      }

      let $treeNode = this.$();
      if (isNone($treeNode)) {
        return;
      }

      let collapse = function($element) {
        let active = $.fn.accordion.settings.className.active;
        if (!isNone($element) && $element.hasClass(active)) {
          $element.removeClass(active);
        }
      };

      collapse($treeNode.children(`.${flexberryClassNames.header}`).first());
      collapse($treeNode.children(`.${flexberryClassNames.content}`).first());
    })

    /**
      Component's action invoking when tree node's header has been clicked.

      @method sendingActions.headerClick
      @param {Object} e Action's event object.
      @param {Object} e.originalEvent [jQuery event object](http://api.jquery.com/category/events/event-object/)
      which describes event that triggers this action.
    */

    /**
      Component's action invoking before node will be expanded.
      Node can be prevented from being expanded with call to action event object's 'originalEvent.stopPropagation()'.

      @method sendingActions.beforeExpand
      @param {Object} e Action's event object.
      @param {Object} e.originalEvent [jQuery event object](http://api.jquery.com/category/events/event-object/)
      which describes event that triggers node's expanding.
    */

    /**
      Component's action invoking before node will be collapsed.
      Node can be prevented from being collapsed with call to action event object's 'originalEvent.stopPropagation()'.

      @method sendingActions.beforeCollapse
      @param {Object} e Action's event object.
      @param {Object} e.originalEvent [jQuery event object](http://api.jquery.com/category/events/event-object/)
      which describes event that triggers node's collapsing.
    */
  }
);

// Add component's CSS-class names as component's class static constants
// to make them available outside of the component instance.
FlexberryTreenodeComponent.reopenClass({
  flexberryClassNames
});

export default FlexberryTreenodeComponent;
