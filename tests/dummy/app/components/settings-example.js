/**
  @module ember-flexberry-dummy
 */

import Ember from 'ember';

/**
  Settings example component.

  @class SettingsExampleComponent
  @extends Ember.Component
 */
export default Ember.Component.extend({
  /**
    A hash of controller properties.

    @property controllerProperties
    @type Object
    @default null
   */
  controllerProperties: null,

  /**
    Settings metadata for component used in example.

    @property componentSettingsMetadata
    @type Object
    @default null
   */
  componentSettingsMetadata: null,

  /**
    Template text for component used in example.

    @property componentTemplateText
    @type String
   */
  componentTemplateText: null,

  /**
    Overflow style of component block.

    @property componentBlockOverflow
    @type String
   */
  componentBlockOverflow: 'scroll',
});
