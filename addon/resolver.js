/**
  @module ember-flexberry
*/

import Ember from 'ember';
import EmberResolver from 'ember-resolver';

/**
  Base ember-flexberry application dependencies resolver.

  Usage:
  ```javascript
  import Ember from 'ember';
  import Resolver from 'ember-flexberry/resolver';

  let App = Ember.Application.extend({
    Resolver: Resolver
  });

  export default App;
  ```

  @class Resolver
  @extends <a href="https://github.com/ember-cli/ember-resolver/blob/master/addon/resolver.js">Ember.Resolver</a>
*/
export default EmberResolver.extend({
  /**
    Initializes resolver.
  */
  init() {
    this._super(...arguments);
  },

  /**
    Checks if template or class with given full name is known and could be resolved.

    @method isKnown
    @param {String} fullName Resource full name (with path inside type-related directory).
    @return {Boolean} Flag: indicates whether given resource is known by application or not.
  */
  isKnown(fullName) {
    let type = fullName.split(':')[0];
    let knownForType = this.knownForType(type) || {};
    return knownForType[fullName] === true;
  },

  /**
    This method is called via the container's resolver method.
    It parses the provided full name and then looks up and returns the appropriate template or class.
    First of all it tries to find appropriate template or class in device-related subfolder, if it is possible,
    otherwise it looks up in default folder related to template or class type.

    @method resolve
    @param {String} fullName Resource full name (with path inside type-related directory).
    @return {Object} The resolved factory.
  */
  resolve(fullName) {
    let device = this.get('device');

    if (Ember.isNone(device)) {
      return this._super(fullName);
    }

    let fullNamePartsArray = fullName.split(':');
    let { resolvingType, resolvingPath } = { resolvingType: fullNamePartsArray[0], resolvingPath: fullNamePartsArray[1] };
    let resolvingPathParts = resolvingPath.split('/');

    let pathPrefixes = device.pathPrefixes(true);
    for (let i = 0, len = pathPrefixes.length; i < len; i++) {
      let pathPrefix = pathPrefixes[i];

      // Change resolvingPath from 'path/name' to 'pathPrefix/path/name.
      // For example 'components/my-component' -> 'tablet-portrait/components/my-component'.
      let newPathParts = Ember.copy(resolvingPathParts);
      newPathParts.unshift(pathPrefix);
      let newPath = newPathParts.join('/');

      // Change resolvingPath in the given fullName (if resolving resource exists in the new device-related path).
      let newFullName = resolvingType + ':' + newPath;
      if (this.isKnown(newFullName)) {
        fullName = newFullName;
        break;
      }
    }

    return this._super(fullName);
  }
});
