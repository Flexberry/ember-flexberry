/**
 * @module ember-flexberry
 */

import Ember from 'ember';

const { getOwner } = Ember;

/**
 * Base component for Flexberry Ember UI Components.
 *
 * @class FlexberryBaseComponent
 */
export default Ember.Component.extend({
  /**
   * Flag: indicates whether component is readonly.
   *
   * @property readonly
   * @type Boolean
   * @default false
   */
  readonly: false,

  /**
   * Flag: indicates whether component is required.
   *
   * @property required
   * @type Boolean
   * @default false
   */
  required: false,

  /**
   * Unique name of the component.
   * TODO: use guidFor from 'ember-metal/utils'
   *
   * @property componentName
   * @type String
   * @default undefined
   */
  componentName: undefined,

  /**
   * Component dynamic properties ({ componentPropertyName: value }).
   * Used when component renders dynamically with ember {{component}} helper:
   * {{component 'my-component' value=value dynamicProperties=myConponentProperties}}.
   * In the end of component initialization its properties values will be replaced with values from this object.
   *
   * @property dynamicProperties
   * @type Object
   * @default null
   */
  dynamicProperties: null,

  /**
   * Model to which current component's value is related.
   *
   * @property relatedModel
   * @type DS.Model
   * @default null
   */
  relatedModel: null,

  /**
   * Path to component's settings in application configuration (JSON from ./config/environment.js).
   *
   * @property appConfigSettingsPath
   * @type String
   * @default 'APP.components.flexberryBaseComponent'
   */
  appConfigSettingsPath: 'APP.components.flexberryBaseComponent',

  /**
   * Application configuration (JSON from ./config/environment.js).
   *
   * @property appConfig
   * @type Object
   */
  appConfig: null,

  /**
   * Component settings object from application configuration (part of JSON from ./config/environment.js).
   * Part of appConfig related to appConfigSettingsPath.
   *
   * @property appConfigSettings
   * @type Object
   */
  appConfigSettings: null,

  /**
   * Current controller.
   * @property currentController
   * @type Ember.Controller
   */
  currentController: null,

  /**
   * Initializes component properties.
   */
  init: function() {
    this._super(...arguments);

    // Get and remember current controller.
    var currentController = this.getTargetObjectByCondition(function(targetObject) {
      return targetObject instanceof Ember.Controller;
    });
    this.set('currentController', currentController);

    // Set related model.
    var relatedModel = this.get('relatedModel');
    if (Ember.isNone(relatedModel) && !Ember.isNone(currentController)) {
      relatedModel = currentController.get('model');
      this.set('relatedModel', relatedModel);
    }

    // Import application config\environment.
    var appConfig = getOwner(this)._lookupFactory('config:environment');
    if (!Ember.isNone(appConfig)) {
      this.set('appConfig', appConfig);
    }

    var appConfigSettingsPath = this.get('appConfigSettingsPath');
    if (Ember.typeOf(appConfigSettingsPath) === 'string') {
      var appConfigSettings = Ember.get(appConfig, appConfigSettingsPath);
      if (!Ember.isNone(appConfigSettings)) {
        this.set('appConfigSettings', appConfigSettings);
      }
    }

    var dynamicProperties = this.get('dynamicProperties');
    if (Ember.typeOf(dynamicProperties) !== 'object') {
      return;
    }

    // Initialize properties for dynamicly-rendered component.
    for (var propertyName in dynamicProperties) {
      if (dynamicProperties.hasOwnProperty(propertyName)) {
        this.set(propertyName, dynamicProperties[propertyName]);
      }
    }
  },

  /**
   * Initializes DOM-related component properties.
   */
  didInsertElement: function() {
    this._super(...arguments);
  },

  /**
   * Cleanup component.
   */
  willDestroy: function() {
    this._super(...arguments);
  },

  /**
   * Cleanup DOM-related component stuff.
   */
  willDestroyElement: function() {
    this._super(...arguments);
  },

  /**
   * Initializes component's property with recpect to following priority:
   * 1 - template-defined parameters,
   * 2 - applicaion configuration-defined parameters (JSON from ./config/environment by path defined in 'appConfigSettingsPath' property),
   * 3 - component-defined defaults.
   * Note! It is important to be declared as undefined for those component properties, which will be initialized through 'initProperty' call.
   *
   * ```javascript
   * // Possible ./config/environment.js.
   * module.exports = function(environment) {
   *   APP: {
   *     components: {
   *       myComponent: {
   *         myComponentProperty: 'myComponentProperty config-defined default value'
   *       }
   *     }
   *   }
   }
   * });
   *
   * var myComponent = FlexberryBaseComponent.extend({
   *   appConfigSettingsPath: 'APP.components.myComponent',
   *
   *   myComponentProperty: undefined,
   *
   *   init: function() {
   *     this._super.apply(this, arguments);
   *     this.initProperty({ propertyName: 'myComponentProperty', defaultValue: 'myComponentProperty default value' });
   *   }
   * });
   * ```
   *
   * @param {Object} options Method options.
   * @param {String} options.propertyName Component's property name.
   * @param {*} options.defaultValue Component's property default value (from component defined default's).
   */
  initProperty: function(options) {
    options = options || {};
    if (Ember.typeOf(options.propertyName) !== 'string') {
      return;
    }

    // If property value is already defined in template,
    // then we should break property initialization.
    var componentDefinedPropertyValue = this.get(options.propertyName);
    if (Ember.typeOf(componentDefinedPropertyValue) !== 'undefined') {
      return;
    }

    // Property value is not defined in template,
    // then we should set configuration-defined value or default.
    var configDefinedPropertyValue;
    var appConfigSettings = this.get('appConfigSettings');
    if (!Ember.isNone(appConfigSettings)) {
      configDefinedPropertyValue = Ember.get(appConfigSettings, options.propertyName);
    }

    if (Ember.typeOf(configDefinedPropertyValue) !== 'undefined') {
      this.set(options.propertyName, configDefinedPropertyValue);
    } else {
      this.set(options.propertyName, options.defaultValue);
    }
  },

  /**
   * Returns that 'targetObject' (from 'targetObject's hierarchy) which satisfies a given condition.
   *
   * ```javascript
   * var controller = this.getTargetObjectByCondition(function(targetObject) {
   *   return targetObject instanceof Ember.Controller;
   * });
   * ```
   *
   * @method getTargetObjectByCondition.
   * @param {Function} condition Callback-function, which will be called for each 'targetObject' in 'targetObject's hierarchy,
   * until callback return true for one of them.
   * @return {null|Ember.Component|Ember.Controller} Target object which satisfies a given condition or null.
   */
  getTargetObjectByCondition: function(condition) {
    if (Ember.typeOf(condition) !== 'function') {
      return null;
    }

    // Component's 'targetObject' is parent component or a controller (in the end of components hierarchy).
    // Search until 'targetObject' is none or condition is true.
    var targetObject = this.get('targetObject');
    while (!(Ember.isNone(targetObject) || condition(targetObject))) {
      targetObject = targetObject.get('targetObject');
    }

    return targetObject;
  }
});
