/**
  @module ember-flexberry-dummy
 */

import Component from '@ember/component';

/**
  Settings example component.

  @class SettingsExampleComponent
  @extends Component
 */
export default Component.extend({
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
