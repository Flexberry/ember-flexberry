import $ from 'jquery';
import Controller from '@ember/controller';
import { isBlank } from '@ember/utils';
import { computed } from '@ember/object';
import { A } from '@ember/array';
import { htmlSafe } from '@ember/string';
import FlexberryTreenodeActionsHandlerMixin from 'ember-flexberry/mixins/flexberry-treenode-actions-handler';
import TreeNodeObject from 'ember-flexberry/objects/tree-node';

export default Controller.extend(FlexberryTreenodeActionsHandlerMixin, {
  /**
    Component's wrapper CSS classes.

    @property jsonTreeClass
    @type String
  */
  jsonTreeClass: '',

  /**
    Flag: indicates whether only one tree node can be expanded at the same time.
    If true, all expanded tree nodes will be automatically collapsed, on some other node expand.

    @property jsonTreeExclusive
    @type Boolean
    @default false
  */
  jsonTreeExclusive: false,

  /**
    Flag: indicates whether it is allowed for already expanded tree nodes to collapse.

    @property jsonTreeCollapsible
    @type Boolean
    @default true
  */
  jsonTreeCollapsible: true,

  /**
    Flag: indicates whether nested child nodes content opacity should be animated
    (if true, it may cause performance issues with many nested child nodes).

    @property jsonTreeAnimateChildren
    @type Boolean
    @default false
  */
  jsonTreeAnimateChildren: false,

  /**
    Tree nodes expand/collapse animation duration in milliseconds.

    @property jsonTreeDuration
    @type Number
    @default 350
  */
  jsonTreeDuration: 350,

  /**
    Tree nodes hierarchy with nodes settings.

    @property jsonTreeNodes
    @type TreeNodeObject[]
  */
  jsonTreeNodes: A([
    TreeNodeObject.create({
      caption: 'Node 1 (with child nodes)',
      nodes: A([
        TreeNodeObject.create({
          caption: 'Node 1.1 (leaf node)',
          nodes: null
        }),
        TreeNodeObject.create({
          caption: 'Node 1.2 (with child nodes)',
          nodes: A([
            TreeNodeObject.create({
              caption: 'Node 1.2.1 (with child nodes)',
              nodes: A([
                TreeNodeObject.create({
                  caption: 'Node 1.2.1.1 (leaf node)',
                  nodes: null
                })
              ])
            }),
            TreeNodeObject.create({
              caption: 'Node 1.2.2 (leaf node)',
              nodes: null
            })
          ])
        }),
      ])
    }),
    TreeNodeObject.create({
      caption: 'Node 2 (leaf node)',
      nodes: null
    }),
    TreeNodeObject.create({
      caption: 'Node 3 (with child nodes)',
      nodes: A([
        TreeNodeObject.create({
          caption: 'Node 3.1 (leaf node)',
          nodes: null
        })
      ])
    })
  ]),

  /**
    Component's template text.

    @property jsonTreeComponentTemplateText
    @type String
  */
  jsonTreeComponentTemplateText: new htmlSafe(
    '{{flexberry-tree<br>' +
    '  class=jsonTreeClass<br>' +
    '  exclusive=jsonTreeExclusive<br>' +
    '  collapsible=jsonTreeCollapsible<br>' +
    '  animateChildren=jsonTreeAnimateChildren<br>' +
    '  duration=jsonTreeDuration<br>' +
    '  nodes=(get-with-dynamic-actions this "jsonTreeNodes"<br>' +
    '    hierarchyPropertyName="nodes"<br>' +
    '    pathKeyword="nodePath"<br>' +
    '    dynamicActions=(array<br>' +
    '      (hash<br>' +
    '        on="headerClick"<br>' +
    '        actionName="onTreenodeHeaderClick"<br>' +
    '        actionArguments=(array "{% nodePath %}")<br>' +
    '      )<br>' +
    '    )<br>' +
    '  )<br>' +
    '}}'),

  /**
    Component settings metadata.
    @property jsonTreeComponentSettingsMetadata
    @type Object[]
  */
  jsonTreeComponentSettingsMetadata: computed(function() {
    let componentSettingsMetadata = A();

    componentSettingsMetadata.pushObject({
      settingName: 'class',
      settingType: 'css',
      settingDefaultValue: '',
      settingAvailableItems: ['styled', 'fluid'],
      bindedControllerPropertieName: 'jsonTreeClass'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'exclusive',
      settingType: 'boolean',
      settingDefaultValue: false,
      bindedControllerPropertieName: 'jsonTreeExclusive'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'collapsible',
      settingType: 'boolean',
      settingDefaultValue: true,
      bindedControllerPropertieName: 'jsonTreeCollapsible'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'animateChildren',
      settingType: 'boolean',
      settingDefaultValue: false,
      bindedControllerPropertieName: 'jsonTreeAnimateChildren'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'duration',
      settingType: 'number',
      settingDefaultValue: 350,
      bindedControllerPropertieName: 'jsonTreeDuration'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'nodes',
      settingType: 'object',
      settingDefaultValue: null,
      bindedControllerPropertieName: 'jsonTreeNodes'
    });

    return componentSettingsMetadata;
  }),

  /**
    Path to controller's property representing latest clicked tree node.

    @property jsonTreeLatestClickedNodePath
    @type String
    @default null
  */
  jsonTreeLatestClickedNodePath: null,

  /**
    Component settings metadata for latest clicked tree node.

    @property jsonTreeLatestClickedNodeComponentSettingsMetadata
    @type Object[]
  */
  jsonTreeLatestClickedNodeComponentSettingsMetadata: computed('jsonTreeLatestClickedNodePath', function() {
    let jsonTreeLatestClickedNodePath = this.get('jsonTreeLatestClickedNodePath');
    let componentSettingsMetadata = A();

    if (isBlank(jsonTreeLatestClickedNodePath)) {
      return componentSettingsMetadata;
    }

    componentSettingsMetadata.pushObject({
      settingName: 'caption',
      settingType: 'string',
      settingDefaultValue: null,
      bindedControllerPropertieName: jsonTreeLatestClickedNodePath + '.caption'
    });

    return componentSettingsMetadata;
  }),

  actions: {
    /**
      Handles tree nodes 'headerClick' action.

      @method actions.onTreenodeHeaderClick
      @param {String} clickedNodePropertiesPath Path to controller's property representing clicked tree node.
      @param {Object} e Action's event object
      @param {Object} e.originalEvent [jQuery event object](http://api.jquery.com/category/events/event-object/)
      which describes event that triggers this action.
    */
    onTreenodeHeaderClick(...args) {
      let actionEventObject = args[args.length - 1];
      let clickedNodePropertiesPath = args[0];
      let clickedNodeSettingsPrefix = $(actionEventObject.originalEvent.currentTarget)
        .closest('.tab.segment')
        .attr('data-tab');

      // Remember latest clicked node path to a tree-related controller's property.
      this.set(clickedNodeSettingsPrefix + 'LatestClickedNodePath', clickedNodePropertiesPath);
    },

    onMyButtonClick() {
      window.alert('My button clicked');
    }
  }
});
