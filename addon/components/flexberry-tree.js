/**
  @module ember-flexberry
*/

import Component from '@ember/component';
import { computed, observer } from '@ember/object';
import { isArray } from '@ember/array';
import FlexberryTreenodeComponent from '../components/flexberry-treenode';

import SlotsMixin from 'ember-block-slots';
import RequiredActionsMixin from '../mixins/required-actions';
import DomActionsMixin from '../mixins/dom-actions';
import DynamicActionsMixin from '../mixins/dynamic-actions';
import DynamicPropertiesMixin from '../mixins/dynamic-properties';

import { translationMacro as t } from 'ember-i18n';

/**
  Component's CSS-classes names.
  JSON-object containing string constants with CSS-classes names related to component's hbs-markup elements.

  @property {Object} flexberryClassNames
  @property {String} flexberryClassNames.prefix Component's CSS-class names prefix ('flexberry-tree').
  @property {String} flexberryClassNames.wrapper Component's wrapping <div> CSS-class name ('flexberry-tree').
  @property {String} flexberryClassNames.header Component's start toolbar CSS-class name ('flexberry-tree-header').
  @property {String} flexberryClassNames.footer Component's end toolbar CSS-class name ('flexberry-tree-footer').
  @property {String} flexberryClassNames.placeholder Component's placeholder CSS-class name ('flexberry-tree-placeholder').
  @readonly
  @static

  @for FlexberryTreeComponent
*/
const flexberryClassNamesPrefix = 'flexberry-tree';
const flexberryClassNames = {
  prefix: flexberryClassNamesPrefix,
  wrapper: flexberryClassNamesPrefix,
  root: flexberryClassNamesPrefix + '-root',
  header: flexberryClassNamesPrefix + '-header',
  footer: flexberryClassNamesPrefix + '-footer',
  placeholder: flexberryClassNamesPrefix + '-placeholder'
};

/**
  Flexberry tree component with [Semantic UI accordion](http://semantic-ui.com/modules/accordion.html) style.
  Component must be used in combination with {{#crossLink "FlexberryTreenodeComponent"}}flexberry-treenode component{{/crossLink}},
  because it's only a wrapper for those tree nodes, which are placed on the same tree level.

  Usage:
  templates/my-form.hbs
  ```handlebars
  {{#flexberry-tree}}
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

  @class FlexberryTreeComponent
  @extends <a href="https://emberjs.com/api/ember/release/classes/Component">Component</a>
  @uses <a href="https://github.com/ciena-blueplanet/ember-block-slots#usage">SlotsMixin</a>
  @uses RequiredActionsMixin
  @uses DomActionsMixin
  @uses DynamicActionsMixin
  @uses DynamicPropertiesMixin
*/
let FlexberryTreeComponent = Component.extend(
  SlotsMixin,
  RequiredActionsMixin,
  DomActionsMixin,
  DynamicActionsMixin,
  DynamicPropertiesMixin, {

    /**
      Flag: indicates whether tree is placed on root level (hasn't parent nodes).

      @property _isRoot
      @type Boolean
      @readonly
      @private
    */
    _isRoot: computed('parentViewExcludingSlots', function() {
      let parentView = this.get('parentViewExcludingSlots');

      return !(parentView instanceof FlexberryTreenodeComponent);
    }),

    /**
      Flag: indicates whether some {{#crossLink "FlexberryTreeComponent/nodes:property"}}tree 'nodes'{{/childNodes}} are defined.

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
      Flag: indicates whether some nested content for header is defined
      (some yield markup for 'header').

      @property _hasHeader
      @type boolean
      @readOnly
      @private
    */
    _hasHeader: computed('_slots.[]', '_isRoot', function() {
      // Yielded {{block-slot "header"}} is defined and current tree is root.
      return this._isRegistered('header') && this.get('isRoot');
    }),

    /**
      Flag: indicates whether some nested content is defined
      (some yield markup or {{#crossLink "FlexberryTreeComponent/nodes:property"}}'nodes'{{/childNodes}} are defined).

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
      Flag: indicates whether some nested content for footer is defined
      (some yield markup for 'footer').

      @property _hasFooter
      @type boolean
      @readOnly
      @private
    */
    _hasFooter: computed('_slots.[]', '_isRoot', function() {
      // Yielded {{block-slot "footer"}} is defined and current tree is root.
      return this._isRegistered('footer') && this.get('isRoot');
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
      {{#flexberry-tree class="styled"}}
        Tree's content
      {{/flexberry-tree}}
      ```

      @property classNames
      @type String[]
      @default ['flexberry-tree', 'accordion']
    */
    classNames: [flexberryClassNames.wrapper, 'accordion'],

    /**
      Component's wrapping <div>
      <a href="https://emberjs.com/api/ember/release/classes/Component#property_classNameBindings">CSS-classes names bindings</a>.

      @property classNameBindings
      @type String[]
      @default ['_isRoot:ui']
    */
    classNameBindings: ['_isRoot:ui', '_isRoot:' + flexberryClassNames.root],

    /**
      Component's placeholder.
      Will be displayed if nested tree nodes are not defined.

      @property placeholder
      @type String
      @default t('components.flexberry-tree.placeholder')
    */
    placeholder: t('components.flexberry-tree.placeholder'),

    /**
      Flag: indicates whether only one tree node can be expanded at the same time.
      If true, all expanded tree nodes will be automatically collapsed, on some other node expand.

      @property exclusive
      @type Boolean
      @default false
    */
    exclusive: false,

    /**
      Flag: indicates whether it is allowed for already expanded tree nodes to collapse.

      @property collapsible
      @type Boolean
      @default true
    */
    collapsible: true,

    /**
      Flag: indicates whether nested child nodes content opacity should be animated
      (if true, it may cause performance issues with many nested child nodes).

      @property animateChildren
      @type Boolean
      @default false
    */
    animateChildren: false,

    /**
      Tree nodes expand/collapse animation duration in milliseconds.

      @property animationDuration
      @type Number
      @default 350
    */
    duration: 350,

    /**
      Tree nodes.
      This property is optional and must be used when there are too many child nodes,
      and you don't want to define them explicitly in the .hbs markup,
      then you can define nodes array somewhere in code & pass defined array to this component's property.

      @property nodes
      @type FlexberryTreenodeObject[]
      @default null
    */
    nodes: null,

    /**
      Initializes [Semantic UI accordion](http://semantic-ui.com/modules/accordion.html) on component's wrapping <div>
      depending on following component's accordion-related properties:
      {{crossLink "FlexberryTreeComponent/exclusive:property"}}'exclusive'{{/crossLink}},
      {{crossLink "FlexberryTreeComponent/collapsible:property"}}'collapsible'{{/crossLink}},
      {{crossLink "FlexberryTreeComponent/animateChildren:property"}}'animateChildren'{{/crossLink}},
      {{crossLink "FlexberryTreeComponent/duration:property"}}'duration'{{/crossLink}}

      @method _initializeAccordion
      @private
    */
    _initializeAccordion() {
      let isRoot = this.get('_isRoot');
      if (isRoot) {
        this.$().accordion({
          exclusive: this.get('exclusive'),
          collapsible: this.get('collapsible'),
          animateChildren: this.get('animateChildren'),
          duration: this.get('duration')
        });
      }
    },

    /**
      Destroys [Semantic UI accordion](http://semantic-ui.com/modules/accordion.html) on component's wrapping <div>.

      @method _destroyAccordion
      @private
    */
    _destroyAccordion() {
      let isRoot = this.get('_isRoot');
      if (isRoot) {
        this.$().accordion('destroy');
      }
    },

    /**
      Reinitializes [Semantic UI accordion](http://semantic-ui.com/modules/accordion.html) on component's wrapping <div>
      when following component's accordion-related properties changed:
      {{crossLink "FlexberryTreeComponent/exclusive:property"}}'exclusive'{{/crossLink}},
      {{crossLink "FlexberryTreeComponent/collapsible:property"}}'collapsible'{{/crossLink}},
      {{crossLink "FlexberryTreeComponent/animateChildren:property"}}'animateChildren'{{/crossLink}},
      {{crossLink "FlexberryTreeComponent/duration:property"}}'duration'{{/crossLink}}

      @method _accordionPropertiesDidChange
      @private
    */
    _accordionPropertiesDidChange: observer(
      'exclusive',
      'collapsible',
      'animateChildren',
      'duration',
      function() {
        // Reinitialize Semantic UI accordion module to change it's settings.
        this._initializeAccordion();
      }),

    /**
      Initializes DOM-related component's properties.
    */
    didInsertElement() {
      this._super(...arguments);

      // Initialize Semantic UI accordion.
      this._initializeAccordion();
    },

    /**
      Destroys DOM-related component's properties.
    */
    willDestroyElement() {
      this._super(...arguments);

      // Collapse parent node (if tree is destroyed then parent node hasn't child nodes anymore).
      //this._collapseParentNode();

      // Destroy Semantic UI accordion.
      this._destroyAccordion();
    }
  }
);

// Add component's CSS-class names as component's class static constants
// to make them available outside of the component instance.
FlexberryTreeComponent.reopenClass({
  flexberryClassNames
});

export default FlexberryTreeComponent;
