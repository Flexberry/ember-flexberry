/**
  @module ember-flexberry
*/

import Ember from 'ember';

/**
  Mixin containing logic making available passing all desirable properties to components
  in a single object, which keys are related to component's desirable properties.

  @class DynamicPropertiesMixin
  @uses <a href="http://emberjs.com/api/classes/Ember.Mixin.html">Ember.Mixin</a>
*/
export default Ember.Mixin.create({
  /**
    Flag: indicates whether component is tagless or not
    (has empty [tagName](http://emberjs.com/api/classes/Ember.Component.html#property_tagName) or not).

    @property isTagless
    @type Boolean
    @readOnly
   */
  isTagless: Ember.computed('tagName', function () {
    let tagName = this.get('tagName');
    if (Ember.typeOf(tagName) === 'string') {
      tagName = Ember.$.trim(tagName);
    }

    return tagName === '';
  }),

  /**
    Object containing dynamic properties that must be assigned to
    component using {{#crossLink "DynamicPropertiesMixin"}}dynamic-properties mixin{{/crossLink}}.

    @property dynamicProperties
    @type Object
    @default null
  */
  dynamicProperties: null,

  /**
    Flag: indicates whether component's wrapper DOM-element is available for select now.

    @property _componentWrapperIsAvailable
    @type Boolean
    @private
  */
  _componentWrapperIsAvailable: false,

  /**
    Array with objects containing names of already assigned
    {{#crossLink "DynamicPropertiesMixin:dynamicProperties:property"}}dynamic properties{{/crossLink}}
    and observer handlers related to them.
    Each object in array has following structure: { propertyName: '...', propertyObserverHandler: function() { ... } }.

    @property _dynamicPropertiesMetadata
    @type Object[]
    @default null
    @private
   */
  _dynamicPropertiesMetadata: null,

  /**
    Adds component's new dynamic property.
    Gets related value from {{#crossLink "DynamicPropertiesMixin:dynamicProperties:property"}}dynamic properties{{/crossLink}},
    and assignes it to related component's property, then attaches observer.

    @method _addDynamicProperty
    @param {String} propertyName Name of dynamic property that must be added.
    @private
  */
  _addDynamicProperty(propertyName) {
    let dynamicProperties = this.get('dynamicProperties');
    if (Ember.isNone(dynamicProperties)) {
      return;
    }

    let previousCustomClassNames = [];
    let setDynamicClassProperty = (propertyValue) => {
      Ember.assert(
          `Wrong type of \`class\` property: ` +
          `actual type is \`${Ember.typeOf(propertyValue)}\`, but \`string\` is expected.`,
          Ember.typeOf(propertyValue) === 'string');

      let customClassNames = Ember.A(propertyValue.split(' ')).map((customClassName) => {
        return Ember.$.trim(customClassName);
      });

      let classNames = this.get('classNames');
      let $component = this.get('_componentWrapperIsAvailable') ? this.$() : null;

      if (!Ember.isArray(classNames)) {
        classNames = [];
        this.set('classNames', classNames);
      }

      // Remove previously added custom class names.
      Ember.A(previousCustomClassNames).forEach((previousCustomClassName) => {
        let index = classNames.indexOf(previousCustomClassName);

        if (index >= 0) {
          classNames.splice(index, 1);

          // For some reason changes to classNames will not cause automatic rerender,
          // so there is no other way to remove class names manually through jQuery methods.
          if (!Ember.isNone($component)) {
            $component.removeClass(previousCustomClassName);
          }
        }
      });

      // Add new custom class names.
      Ember.A(customClassNames).forEach((customClassName) => {
        classNames.push(customClassName);

        // For some reason changes to classNames will not cause automatic rerender,
        // so there is no other way to add class names manually through jQuery methods.
        if (!Ember.isNone($component)) {
          $component.addClass(customClassName);
        }
      });

      // Remember added custom class names in the context of property observer handler.
      previousCustomClassNames = customClassNames;
    };

    let setDynamicProperty = () => {
      let propertyValue = this.get(`dynamicProperties.${propertyName}`);
      if (!this.get('isTagless') && propertyName === 'class') {
        setDynamicClassProperty(propertyValue);
      } else {
        this.set(propertyName, propertyValue);
      }
    };

    if (propertyName === 'computedProperties') {
      let propertyValue = this.get(`dynamicProperties.computedProperties`);
      let thisController = propertyValue.thisController;
      thisController.set('computedProperties', this);
      return;
    }

    setDynamicProperty();
    this.addObserver(`dynamicProperties.${propertyName}`, setDynamicProperty);

    let dynamicPropertiesMetadata = this.get('_dynamicPropertiesMetadata');
    dynamicPropertiesMetadata.pushObject({
      propertyName: propertyName,
      propertyObserverHandler: setDynamicProperty
    });
  },

  /**
    Removes component's previously added dynamic property.
    Removes related component's property & observer.

    @method _removeDynamicProperty
    @param {String} propertyName Name of dynamic property that must be removed.
    @private
  */
  _removeDynamicProperty(propertyName) {
    let dynamicPropertiesMetadata = this.get('_dynamicPropertiesMetadata');
    let dynamicPropertyMetadata = dynamicPropertiesMetadata.filter((metadata) => {
      return metadata.propertyName === propertyName;
    })[0];

    if (Ember.isNone(dynamicPropertyMetadata)) {
      return;
    }

    // Set undefined in ember-way to notify component's related observers & computed properties.
    this.set(propertyName, undefined);

    // Delete property.
    delete this[propertyName];

    // Remove observer.
    this.removeObserver(`dynamicProperties.${propertyName}`, Ember.get(dynamicPropertyMetadata, 'propertyObserverHandler'));

    // Remove metadata.
    dynamicPropertiesMetadata.removeObject(dynamicPropertyMetadata);
  },

  /**
    Removes component's all previously added dynamic properties.
    Removes related component's properties & observers.

    @method _removeDynamicProperties
    @private
  */
  _removeDynamicProperties() {
    let dynamicPropertiesMetadata = this.get('_dynamicPropertiesMetadata');
    var len = Ember.get(dynamicPropertiesMetadata, 'length');
    while (--len >= 0) {
      let dynamicPropertyMetadata = dynamicPropertiesMetadata[len];
      this._removeDynamicProperty(Ember.get(dynamicPropertyMetadata, 'propertyName'));
    }
  },

  /**
    Observes & handles any changes in
    {{#crossLink "DynamicPropertiesMixin/dynamicProperties:property"}}'dynamicProperties'{{/crossLink}},
    assigns actual values to a component's related properties (including initialization moment).

    @method _dynamicPropertiesDidChange
    @private
  */
  _dynamicPropertiesDidChange: Ember.observer('dynamicProperties', function () {
    let dynamicProperties = this.get('dynamicProperties');
    Ember.assert(
      `Wrong type of \`dynamicProperties\` property: ` +
      `actual type is \`${Ember.typeOf(dynamicProperties)}\`, but \`object\` or \`instance\` is expected.`,
      Ember.isNone(dynamicProperties) ||
      Ember.typeOf(dynamicProperties) === 'object' ||
      Ember.typeOf(dynamicProperties) === 'instance');

    let dynamicPropertiesMetadata = this.get('_dynamicPropertiesMetadata');
    if (Ember.isNone(dynamicPropertiesMetadata)) {
      dynamicPropertiesMetadata = Ember.A();
      this.set('_dynamicPropertiesMetadata', dynamicPropertiesMetadata);
    }

    // Clean up results of previous assignments.
    this._removeDynamicProperties();

    // Break after clean up, if new dynamic properties are none.
    if (Ember.isNone(dynamicProperties)) {
      return;
    }

    // Perform new assignments if new dynamic properties are defined.
    let dynamicPropertiesNames = Object.keys(dynamicProperties);
    for (let i = 0, len = dynamicPropertiesNames.length; i < len; i++) {
      this._addDynamicProperty(dynamicPropertiesNames[i]);
    }
  }),

  init() {
    this._super(...arguments);
    this._dynamicPropertiesDidChange();
  },

  /**
    Executes component's DOM-related logic.
  */
  didInsertElement() {
    this._super(...arguments);

    // We must know this to handle changes in component's 'class' property.
    this.set('_componentWrapperIsAvailable', true);
  },

  /**
    Executes component's DOM-related clean up logic.
  */
  willDestroyElement() {
    this._super(...arguments);

    // We must know this to handle changes in component's 'class' property.
    this.set('_componentWrapperIsAvailable', false);
  },

  /**
    Handles component's destroy.
    Removes component's all previously added dynamic properties.
  */
  willDestroy() {
    this._super(...arguments);

    // This call is needed to remove dynamically added observers.
    this._removeDynamicProperties();
  }
});
