/**
 * @module ember-flexberry
 */

import Ember from 'ember';
import EmberResolver from 'ember-resolver';

/**
 * Base ember-flexberry application dependencies resolver.
 * @class Resolver
 * @extends EmberResolver
 */
export default EmberResolver.extend({

  /**
   * Initializes resolver.
   */
  init: function() {
    this._super(...arguments);
  },

  /**
   * Checks if template or classs with given full name is known and could be resolved.
   */
  isKnown: function(fullName) {
    var type = fullName.split(':')[0];
    var knownForType = this.knownForType(type) || {};
    return knownForType[fullName] === true;
  },

  /**
   * This method is called via the container's resolver method.
   * It parses the provided full name and then looks up and returns the appropriate template or class.
   * First of all it tries to find appropriate template or class in device-related subfolder, if it is possible,
   * otherwise it looks up in default folder related to template or class type.
   *
   * @method resolve
   * @param {String} fullName The lookup string.
   * @return {Object} The resolved factory.
   * @public
   */
  resolve: function(fullName) {
    var device = this.get('device');

    if (Ember.isNone(device)) {
      return this._super(fullName);
    }

    var fullNamePartsArray = fullName.split(':');
    var { resolvingType, resolvingPath } = { resolvingType: fullNamePartsArray[0], resolvingPath: fullNamePartsArray[1] };
    var resolvingPathParts = resolvingPath.split('/');

    var pathPrefixes = device.pathPrefixes(true);
    for (var i = 0, len = pathPrefixes.length; i < len; i++) {
      var pathPrefix = pathPrefixes[i];

      // Change resolvingPath from 'path/name' to 'pathPrefix/path/name.
      // For example 'components/my-component' -> 'tablet-portrait/components/my-component'.
      var newPathParts = Ember.copy(resolvingPathParts);
      newPathParts.unshift(pathPrefix);
      var newPath = newPathParts.join('/');

      // Change resolvingPath in the given fullName (if resolving resource exists in the new device-related path).
      var newFullName = resolvingType + ':' + newPath;
      if (this.isKnown(newFullName)) {
        fullName = newFullName;
        break;
      }
    }

    return this._super(fullName);
  }
});
