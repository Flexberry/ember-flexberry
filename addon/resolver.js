/**
  @module ember-flexberry
*/

import { isNone } from '@ember/utils';
import { assert } from '@ember/debug';
import { isArray } from '@ember/array';
import { copy } from '@ember/object/internals';
import EmberResolver from 'ember-resolver';

/**
  Base ember-flexberry application dependencies resolver.

  Usage:
  ```javascript
  import Application from '@ember/application';
  import Resolver from 'ember-flexberry/resolver';

  let App = Application.extend({
    Resolver: Resolver
  });

  export default App;
  ```

  @class Resolver
  @extends <a href="https://github.com/ember-cli/ember-resolver/blob/master/addon/resolver.js">EmberResolver</a>
*/
export default EmberResolver.extend({
  /**
    Names of types which needs to be resolved with prefixes received through a {{#crossLink "DeviceService"}}device service{{/crossLink}}.

    @property deviceRelatedTypes
    @type Array
    @default ['component', 'template', 'view']
  */
  deviceRelatedTypes: undefined,

  /**
    Initializes resolver.
  */
  init() {
    this._super(...arguments);
    this.set('deviceRelatedTypes', [
      'component',
      'template',
      'view',
    ]);
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

    if (isNone(device)) {
      return this._super(fullName);
    }

    let fullNamePartsArray = fullName.split(':');
    let { resolvingType, resolvingPath } = { resolvingType: fullNamePartsArray[0], resolvingPath: fullNamePartsArray[1] };
    let resolvingPathParts = resolvingPath.split('/');

    if (this._resolveTypeWithDeviceTypeDetection(resolvingType) && !this._resolveResourceWithoutDeviceTypeDetection(fullName)) {
      let pathPrefixes = device.pathPrefixes(true);
      for (let i = 0, len = pathPrefixes.length; i < len; i++) {
        let pathPrefix = pathPrefixes[i];

        // Change resolvingPath from 'path/name' to 'pathPrefix/path/name.
        // For example 'components/my-component' -> 'tablet-portrait/components/my-component'.
        let newPathParts = copy(resolvingPathParts);
        newPathParts.unshift(pathPrefix);
        let newPath = newPathParts.join('/');

        // Change resolvingPath in the given fullName (if resolving resource exists in the new device-related path).
        let newFullName = resolvingType + ':' + newPath;
        if (this.isKnown(newFullName)) {
          fullName = newFullName;
          break;
        }
      }
    }

    return this._super(fullName);
  },

  /**
    Determines if resource should be resolved with origin resolving path.
    Returns true if full name of resource was specified in 'resolveWithoutDeviceTypeDetection' application setting.

    @method _resolveResourceWithoutDeviceTypeDetection
    @param {String} fullName Resource full name (with path inside type-related directory).
    @return {Boolean} Flag: indicates whether given resource should be resolved with origin resolving path.
    @private
  */
  _resolveResourceWithoutDeviceTypeDetection(fullName) {
    if (this.namespace && this.namespace.resolveWithoutDeviceTypeDetection && isArray(this.namespace.resolveWithoutDeviceTypeDetection)) {
      let resourceTypesToApplyOriginResolving = this.namespace.resolveWithoutDeviceTypeDetection;
      return resourceTypesToApplyOriginResolving.indexOf(fullName) > -1;
    }

    return false;
  },

  /**
    Checks that 'type' needs to be resolved with prefixes received through a {{#crossLink "DeviceService"}}device service{{/crossLink}}.

    @method _resolveTypeWithDeviceTypeDetection
    @param {String} type
    @return {Boolean}
    @private
  */
  _resolveTypeWithDeviceTypeDetection(type) {
    let deviceRelatedTypes = this.get('deviceRelatedTypes');
    assert(`Property 'deviceRelatedTypes' must be a array.`, isArray(deviceRelatedTypes));
    return deviceRelatedTypes.indexOf(type) > -1;
  },
});
