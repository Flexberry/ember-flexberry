/**
  @module ember-flexberry
*/

import Helper from '@ember/component/helper';
import { assert } from '@ember/debug';
import { typeOf, isBlank, isNone } from '@ember/utils';
import { A, isArray } from '@ember/array';
import { get, set } from '@ember/object';
import { addObserver, removeObserver } from '@ember/object/observers';
import DynamicActionObject from '../objects/dynamic-action';
import { render } from '../utils/string';
import { getRecord } from '../utils/extended-get';

// Validates helper's properties.
// Not a helper member, so yuidoc-comments are unnecessary.
let validateHelperProperties = function(args, hash) {
  assert(
    'Exactly two unnamed arguments must be passed to `get-with-dynamic-actions` helper.',
    args.length === 2);

  let propertyOwner = args[0];
  assert(
    `Wrong type of \`get-with-dynamic-actions\` helper\`s first argument: ` +
    `actual type is \`${typeOf(propertyOwner)}\`, but \`object\` or \`instance\` is expected.`,
    typeOf(propertyOwner) === 'object' || typeOf(propertyOwner) === 'instance');

  let propertyName = args[1];
  assert(
    `Wrong type of \`get-with-dynamic-actions\` helper\`s second argument: ` +
    `actual type is \`${typeOf(propertyName)}\`, but \`string\` is expected.`,
    typeOf(propertyName) === 'string');

  let hierarchyPropertyName = get(hash, 'hierarchyPropertyName');
  assert(
    `Wrong type of \`get-with-dynamic-actions\` helper\`s \`hierarchyPropertyName\` property: ` +
    `actual type is \`${typeOf(hierarchyPropertyName)}\`, but \`string\` is expected.`,
    isNone(hierarchyPropertyName) || typeOf(hierarchyPropertyName) === 'string');

  let dynamicActions = get(hash, 'dynamicActions');
  assert(
    `Wrong type of \`get-with-dynamic-actions\` helper\`s \`dynamicActions\` property: ` +
    `actual type is \`${typeOf(dynamicActions)}\`, but \`array\` is expected.`,
    isNone(dynamicActions) || isArray(dynamicActions));
};

// Returns new action arguments array where template-like substrings in string arguments
// are replaced with related context's properties.
// Not a helper member, so yuidoc-comments are unnecessary.
let getRenderedDynamicActionArguments = function(actionArguments, renderingContext) {
  if (!isArray(actionArguments)) {
    return A();
  }

  // Some action arguments could be a strings with following substrings (templates) inside them: {% path %}.
  // We should replace these templates with context's related properties (current object's path instead of {% path %}, etc.),
  // before arguments will be binded to dynamic actions.
  let renderedActionArguments = [];
  for (let i = 0, len = actionArguments.length; i < len; i++) {
    let actionArgument = actionArguments[i];
    if (typeOf(actionArgument) === 'string') {
      renderedActionArguments[i] = render(actionArgument, {
        context: renderingContext,
        delimiters: ['{%', '%}']
      });
    } else {
      renderedActionArguments[i] = actionArgument;
    }
  }

  return renderedActionArguments;
};

/**
  Get with dynamic actions helper.
  Retrieves property with the specified name from the specified object
  (exactly as [standard get helper](http://emberjs.com/api/classes/Ember.Templates.helpers.html#method_get) does),
  and additionally binds dynamic actions for retrieved property's nested object/objects
  (even if retrieved property has hierarchical structure).

  Helper must be used with those component's,
  which consumes their inner structure as [JSON-object](http://www.json.org/)
  or [Ember-object](http://emberjs.com/api/classes/Ember.Object.html)
  and there is no way to attach action handlers for their nested component's explicitly in hbs-markup.

  @class GetWithDynamicActionsHelper
  @extends <a href="http://emberjs.com/api/classes/Ember.Helper.html">Ember.Helper</a>

  Usage:
  templates/my-form.hbs
  ```handlebars
  {{!-- Without custom "path" keyword (default keyword "path" will be used) --}}
  {{flexberry-tree
    nodes=(get-with-dynamic-actions this "treeNodes"
      hierarchyPropertyName="nodes"
      dynamicActions=(array
        (hash
          on="headerClick"
          actionName="onTreenodeHeaderClick"
          actionArguments=(array "{% path %}")
        )
        (hash
          on="checkboxChange"
          actionName="onTreenodeCheckboxChange"
          actionArguments=(array "{% path %}.checkboxValue")
        )
      )
    )
  }}

  {{!-- With custom "path" keyword --}}
  {{flexberry-tree
    nodes=(get-with-dynamic-actions this "treeNodes"
      hierarchyPropertyName="nodes"
      pathKeyword="nodePath"
      dynamicActions=(array
        (hash
          on="headerClick"
          actionName="onTreenodeHeaderClick"
          actionArguments=(array "{% nodePath %}")
        )
        (hash
          on="checkboxChange"
          actionName="onTreenodeCheckboxChange"
          actionArguments=(array "{% nodePath %}.checkboxValue")
        )
      )
    )
  }}
  ```

  controllers/my-form.js
  ```javascript
  import Controller from '@ember/controller';
  import TreeNodeObject from 'ember-flexberry/objects/flexberry-treenode';

  export default Controller.extend({
    treeNodes: Ember.A([
      FlexberryTreenodeObject.create({
        caption: 'Node 1 (with child nodes)',
        hasCheckbox: true,
        checkboxValue: false,
        iconClass: 'map icon',
        nodes: Ember.A([
          caption: 'Node 1.1 (leaf node)',
          hasCheckbox: true,
          checkboxValue: false,
          iconClass: 'apple icon',
          nodes: null
        ])
      }),
      FlexberryTreenodeObject.create({
        caption: 'Node 2 (leaf node)',
        hasCheckbox: true,
        checkboxValue: false,
        iconClass: 'compass icon',
        nodes: null
      })
    ]),

    actions: {
      onTreenodeHeaderClick(...args) {
        let treeNodePath = args[0];
        let treeNodeHeaderClickActionEventObject = args[args.length - 1];

        console.log('Clicked tree node\'s properties:', this.get(treeNodePath));
        console.log('Clicked tree node\'s \'headerClick\' action event object:', treeNodeHeaderClickActionEventObject);
      },

      onTreenodeCheckboxChange(...args) {
        let treeNodeCheckboxValuePath = args[0];
        let treeNodeCheckboxChangeActionEventObject = args[args.length - 1];

        // Change tree node's 'checkboxValue' property.
        this.set(treeNodeCheckboxValuePath, treeNodeCheckboxChangeActionEventObject.newValue);
      }
    }
  });
  ```
*/
export default Helper.extend({
  /**
    Owner of hierarchy root property.

    @property _rootPropertyOwner
    @type Object
    @default null
    @private
  */
  _rootPropertyOwner: null,

  /**
    Name of those property which must be retrieved from owner & returned from helper
    (after dynamic actions binding).

    @property _rootPropertyName
    @type String
    @private
  */
  _rootPropertyName: null,

  /**
    Name of nested property (inside retrieved one), through which
    child object/objects (objects hierarchy) is/are available.

    @property _hierarchyPropertyName
    @type String
    @private
  */
  _hierarchyPropertyName: null,

  /**
    Dynamic actions, which will be binded to object/objects retrieved from the
    {{#crossLink "GetWithDynamicActionsHelper/_rootPropertyOwner:property"}}owner{{/crossLink}}
    (and to all nested child objects).

    @property _dynamicActions
    @type DynamicActionObject[]
    @private
  */
  _dynamicActions: null,

  /**
    Array with objects containing names of hierarchy properties and observer handlers related to them.
    Each object in array has following structure: { propertyPath: '...', observerHandler: function() { ... } }.

    @property _hierarchyPropertiesObservers
    @type Object[]
    @default null
    @private
   */
  _hierarchyPropertiesObservers: null,

  /**
    Adds observer for given hierarchy property, which will force helper to recompute
    on any changes in the specified hierarchy property.

    @method _addHierarchyPropertyObserver
    @param {String} propertyPath Path to observable property.
    @private
  */
  _addHierarchyPropertyObserver(propertyPath) {
    let hierarchyPropertiesObservers = this.get('_hierarchyPropertiesObservers');
    if (isNone(hierarchyPropertiesObservers)) {
      hierarchyPropertiesObservers = A();
      this.set('_hierarchyPropertiesObservers', hierarchyPropertiesObservers);
    }

    let observer = hierarchyPropertiesObservers.find((observer) => {
      return get(observer, 'propertyPath') === propertyPath;
    });
    if (isNone(observer)) {
      observer = {
        propertyPath: propertyPath,
        referenceObserver: null,
        arrayObserver: null
      };
      hierarchyPropertiesObservers.pushObject(observer);
    }

    let arrayObserver = {
      /* eslint-disable no-unused-vars */
      arrayWillChange: (arr, start, removeCount, addCount) => {
        // Remove observers from removing properties (while properties still exists).
        if (removeCount !== 0) {
          for (let i = start; removeCount > 0 && i < start + removeCount; i++) {
            let removingPropertyPath = `${propertyPath}.${i}`;

            this._removeHierarchyPropertiesObservers({
              propertyPathStartsWith: removingPropertyPath,
              status: 'Delete'
            });
          }
        } else {
          for (let i = start; i < start + 2; i++) {
            let replacePropertyPath = `${propertyPath}.${i}`;

            this._removeHierarchyPropertiesObservers({
              propertyPathStartsWith: replacePropertyPath,
              status: 'Replace'
            });
          }
        }

      },
      /* eslint-enable no-unused-vars */

      /* eslint-disable no-unused-vars */
      arrayDidChange: (arr, start, removeCount, addCount) => {
        // Bind dynamic actions for added property, and rebind for following ones (till the end of array), or
        // rebind dynamic actions for properties following after removed ones (till the end of array).
        for (let i = start, len = arr.length; i < len; i++) {
          let addedOrMovedPropertyPath = `${propertyPath}.${i}`;
          let addedOrMovedPropertyValue = getRecord(this, `_rootPropertyOwner.${addedOrMovedPropertyPath}`);

          this._bindDynamicActions({
            propertyPath: addedOrMovedPropertyPath,
            propertyValue: addedOrMovedPropertyValue,

            // Don't observe properties containing inside arrays,
            // it's unnecessary, because whole array has special observer.
            propertyIsObservable: false
          });
        }
      }
      /* eslint-enable no-unused-vars */
    };

    let referenceObserver = () => {
      let rootPropertyOwner = this.get('_rootPropertyOwner');
      let propertyValue = getRecord(rootPropertyOwner, propertyPath);

      // Property-object reference changed.
      // Remove old observers.
      this._removeHierarchyPropertiesObservers({
        propertyPathStartsWith: propertyPath
      });

      // Bind dynamic actions for new property-object.
      // It will add new observers.
      this._bindDynamicActions({
        propertyValue: propertyValue,
        propertyPath: propertyPath
      });
    };

    let rootPropertyOwner = this.get('_rootPropertyOwner');
    let propertyValue = getRecord(rootPropertyOwner, propertyPath);

    // Observe property reference.
    if (isNone(get(observer, 'referenceObserver'))) {
      set(observer, 'referenceObserver', referenceObserver);
      addObserver(rootPropertyOwner, propertyPath, referenceObserver);
    }

    // Observe property content.
    if (isArray(propertyValue) && isNone(get(observer, 'arrayObserver'))) {
      set(observer, 'arrayObserver', arrayObserver);
      propertyValue.addArrayObserver(arrayObserver);
    }
  },

  /**
    Removes all previously attached to hierarchy properties observers.

    @method _removeHierarchyPropertiesObservers
    @param {Object} options Method options.
    @param {String} options.propertyPath Path to property from which observers must be removed.
    @param {String} options.propertyPathStartsWith Prefix of path to properties from which observers must be removed.
    @private
  */
  _removeHierarchyPropertiesObservers(options) {
    options = options || {};
    let propertyPath =  get(options, 'propertyPath');
    let propertyPathStartsWith = get(options, 'propertyPathStartsWith');
    let observerCanBeRemoved = function(observer) {
      let observerPropertyPath = get(observer, 'propertyPath');

      return isNone(propertyPath) && isNone(propertyPathStartsWith) ||
        typeOf(propertyPath) === 'string' && observerPropertyPath === propertyPath ||
        typeOf(propertyPathStartsWith) === 'string' && observerPropertyPath.indexOf(propertyPathStartsWith) === 0;
    };

    let rootPropertyOwner = this.get('_rootPropertyOwner');
    let hierarchyPropertiesObservers = this.get('_hierarchyPropertiesObservers');
    let len = hierarchyPropertiesObservers.length;
    hierarchyPropertiesObservers = this._sort(hierarchyPropertiesObservers);
    while (--len >= 0) {
      let observer = hierarchyPropertiesObservers[len];
      if (!observerCanBeRemoved(observer)) {
        continue;
      }

      let observerPropertyPath = get(observer, 'propertyPath');
      let observerPropertyValue = getRecord(rootPropertyOwner, observerPropertyPath);

      let status = get(options, 'status');
      if (status === 'Delete') {
        this._renamePropertyPath(observerPropertyPath, len);
      }

      let referenceObserver = get(observer, 'referenceObserver');
      removeObserver(rootPropertyOwner, observerPropertyPath, referenceObserver);

      let arrayObserver = get(observer, 'arrayObserver');
      if (isArray(observerPropertyValue)) {
        observerPropertyValue.removeArrayObserver(arrayObserver);
      }

      hierarchyPropertiesObservers.removeAt(len);
    }

    if (hierarchyPropertiesObservers.length === 0) {
      this.set('_hierarchyPropertiesObservers', null);
    }
  },

  /**
    Renames property path of observers.

    @method _renamePropertyPath
    @param {String} observerPropertyPath Path to property from which observers must be removed.
    @param {Number} len Index of observer in the array to be removed.
    @private
  */
  _renamePropertyPath(observerPropertyPath, len) {
    let hierarchyPropertiesObservers = this.get('_hierarchyPropertiesObservers');
    let rootPropertyOwner = this.get('_rootPropertyOwner');
    let observerPropertyPathArray = observerPropertyPath.split('.');

    if (observerPropertyPathArray.length >= 3) {

      let arrayForSubstring = observerPropertyPathArray.slice(0, observerPropertyPathArray.length - 2);
      let checkSubstring = arrayForSubstring.join('.');

      for (let i = len + 1; i < hierarchyPropertiesObservers.length; i++) {
        let observer = hierarchyPropertiesObservers[i];

        let updatableObserverPropertyPath = get(observer, 'propertyPath');
        let updatableObserverPropertyPathArray = updatableObserverPropertyPath.split('.');
        let newObserverPropertyPath = updatableObserverPropertyPathArray[0];

        for (let j = 1; j < updatableObserverPropertyPathArray.length; j++) {
          if ((j === (observerPropertyPathArray.length - 2)) && (checkSubstring === newObserverPropertyPath)) {
            newObserverPropertyPath += '.' + (updatableObserverPropertyPathArray[j] - 1).toString();

            let observerPropertyValue = getRecord(rootPropertyOwner, updatableObserverPropertyPath);
            let referenceObserver = get(observer, 'referenceObserver');
            removeObserver(rootPropertyOwner, updatableObserverPropertyPath, referenceObserver);

            let arrayObserver = get(observer, 'arrayObserver');
            if (isArray(observerPropertyValue)) {
              observerPropertyValue.removeArrayObserver(arrayObserver);
            }

          } else {
            newObserverPropertyPath += '.' + updatableObserverPropertyPathArray[j];
          }
        }

        set(observer, 'propertyPath', newObserverPropertyPath);
      }
    }
  },

  /**
    Sort array with hierarchy properties observers.

    @method _sort
    @param {Array} hierarchyPropertiesObservers Array with hierarchy properties observers.
    @private
  */
  _sort(hierarchyPropertiesObservers) {

    let sortArray = hierarchyPropertiesObservers.sort(function (a, b) {
      if (a.propertyPath > b.propertyPath) {
        return 1;
      }

      if (a.propertyPath < b.propertyPath) {
        return -1;
      }

      return 0;
    });
    return sortArray;
  },

  /**
    Binds given dynamic actions to every object in the specified hierarchy.

    @method _bindDynamicActions
    @param {Object|Object[]} propertyValue Value of some property in the specified hierarchy.
    @param {String} propertyPath Path to property in the specified hierarchy.
    @param {String} Name of property that leads to nested child properties in the specified hierarchy.
    @param {DynamicAction[]} Specified dynamic actions.
    @private
  */
  _bindDynamicActions(options) {
    options = options || {};
    let propertyValue = get(options, 'propertyValue');
    let propertyPath = get(options, 'propertyPath');
    let propertyIsObservable = get(options, 'propertyIsObservable');

    let hierarchyPropertyName = this.get('_hierarchyPropertyName');
    let dynamicActions = this.get('_dynamicActions');

    if (propertyIsObservable !== false) {
      // Add property observer to force helper recompute, if some new objects appear/remove in hierarchy.
      this._addHierarchyPropertyObserver(`${propertyPath}`);
    }

    if (isNone(propertyValue)) {
      return;
    }

    // If property is array, then attach dynamic actions for each object in array.
    if (isArray(propertyValue)) {
      for (let i = 0, len = propertyValue.length; i < len; i++) {
        this._bindDynamicActions({
          propertyValue: propertyValue.objectAt(i),
          propertyPath: `${propertyPath}.${i}`,

          // Don't observe properties containing inside arrays,
          // it's unnecessary, because whole array has special observer.
          propertyIsObservable: false
        });
      }

      return;
    }

    // Here 'propertyValue' is strict an object or an instance.
    assert(
      `Wrong type of \`${propertyPath}\` property retrieved through \`get-with-dynamic-actions\` helper: ` +
      `actual type is \`${typeOf(propertyValue)}\`, but \`object\` or \`instance\` is expected.`,
      typeOf(propertyValue) === 'object' || typeOf(propertyValue) === 'instance');

    // Prepare & add dynamic actions for current 'propertyValue' (which is always object or instance here).
    if (isArray(dynamicActions)) {
      let preparedDynamicActions = A();

      for (let i = 0, len = dynamicActions.length; i < len; i++) {
        let dynamicAction = dynamicActions[i];

        let argumentsRenderingContext = {};
        argumentsRenderingContext[this.get('_pathKeyword')] = propertyPath;

        // Helper shouldn't mutate given data, so we need to create new dynamic action with modified properties.
        let preparedDynamicAction = DynamicActionObject.create({
          on: get(dynamicAction, 'on'),
          actionHandler: get(dynamicAction, 'actionHandler'),
          actionName: get(dynamicAction, 'actionName'),

          // Use 'rootPropertyOwner' as action context (if context is not defined explicitly).
          actionContext: get(dynamicAction, 'actionContext') || this.get('_rootPropertyOwner'),

          // Perform template substitutions inside action arguments.
          actionArguments: getRenderedDynamicActionArguments(
            get(dynamicAction, 'actionArguments'),
            argumentsRenderingContext)
        });

        preparedDynamicActions.pushObject(preparedDynamicAction);
      }

      set(propertyValue, 'dynamicActions', preparedDynamicActions);
    }

    // Recursively bind dynamic actions to nested child properties.
    if (!isBlank(hierarchyPropertyName) && typeOf(hierarchyPropertyName) === 'string') {
      this._bindDynamicActions({
        propertyValue: get(propertyValue, hierarchyPropertyName),
        propertyPath: `${propertyPath}.${hierarchyPropertyName}`
      });
    }
  },

  /**
    Overridden [Ember.Helper compute method](http://emberjs.com/api/classes/Ember.Helper.html#method_compute).
    Executes helper's logic, returns helper's value.

    @method compute
    @param {any[]} args [Helper arguments](https://guides.emberjs.com/v2.4.0/templates/writing-helpers/#toc_helper-arguments).
    @param {Object} args.0 Property owner, object containing property which must be retrieved & returned from helper
    (after dynamic action binding).
    Will be also used as action handlers context (if context wasn't specified explicitly in dynamic action bindings).
    @param {String} args.1 Name of those property which must be retrieved from owner & returned from helper
    (after dynamic actions binding).
    Owner's property (behind this name) must be an object or array of objects.
    @param {Object} [hash] Object containing
    [helper's named arguments](https://guides.emberjs.com/v2.4.0/templates/writing-helpers/#toc_named-arguments).
    @param {Object} [hash.hierarchyPropertyName] Name of nested property (inside retrieved one), through which
    child object/objects (objects hierarchy) will be available.
    @param {DynamicActionObject[]} [hash.dynamicActions] Dynamic actions, which will be binded
    to object/objects retrieved from the owner (and to all nested child objects).
    @return {Object|Object[]} Retrieved object/objects with binded dynamic actions (including nested child objects).
  */
  compute(args, hash) {
    validateHelperProperties(args, hash);

    let propertyOwner = args[0];
    let propertyName = args[1];
    let hierarchyPropertyName = get(hash, 'hierarchyPropertyName');
    let pathKeyword = get(hash, 'pathKeyword') || 'path';
    let dynamicActions = get(hash, 'dynamicActions');

    this.set('_rootPropertyOwner', propertyOwner);
    this.set('_rootPropertyName', propertyName);
    this.set('_hierarchyPropertyName', hierarchyPropertyName);
    this.set('_pathKeyword', pathKeyword);
    this.set('_dynamicActions', dynamicActions);

    let propertyValue = get(propertyOwner, propertyName);
    this._bindDynamicActions({
      propertyValue: propertyValue,
      propertyPath: propertyName,
    });

    return propertyValue;
  },

  /**
    Destroys helper.
  */
  willDestroy() {
    this._super(...arguments);

    this._removeHierarchyPropertiesObservers();
    this.set('_rootPropertyOwner', null);
    this.set('_dynamicActions', null);
  }
});
