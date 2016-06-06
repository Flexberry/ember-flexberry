/**
 * @module ember-flexberry
 */

import Ember from 'ember';

/**
 * Service for devices detection.
 * Uses devicejs with noConflict (see https://github.com/matthewhudson/device.js).
 *
 * @class DeviceService
 * @extends Ember.Service
 * @public
 */
export default Ember.Service.extend(Ember.Evented, {
  /**
   * Initializes service.
   */
  init: function() {
    this._super(...arguments);

    var device = window.device;
    if (device && device.noConflict) {
      // No conflict devicejs library reference.
      var devicejs = device.noConflict();

      // Names of devicejs library features.
      var devicejsPropertiesNames = Object.keys(devicejs);

      // Inject devicejs library features into service.
      for (var i = 0, len = devicejsPropertiesNames.length; i < len; i++) {
        var propertieName = devicejsPropertiesNames[i];
        this.set(propertieName, devicejs[propertieName]);
      }

      // Attach orientation change handler.
      this.set('_onOrientationChange', this._onOrientationChange.bind(this));
      Ember.$(window).on('resize orientationchange', this._onOrientationChange);
    } else {
      Ember.Logger.error('Device service error. Can\'t find device.js entry point.');
    }
  },

  /**
   * Destroys service.
   */
  willDestroy: function() {
    this._super(...arguments);

    Ember.$(window).off('resize orientationchange', this._onOrientationChange);
  },

  /**
   * Device orientation.
   *
   * @method orientation
   * @param useCached {Boolean} Flag: indicates whether to use already cached value or not.
   * @return {String} Returns current device orientation ('landscape' or 'portrait').
   */
  orientation: function(useCached) {
    var orientation;
    if (useCached === true && (orientation = this.get('_cache.orientation')) !== null) {
      return orientation;
    }

    orientation = this.portrait() ? 'portrait' : 'landscape';
    this.set('_cache.orientation', orientation);

    return orientation;
  },

  /**
   * Device platform.
   *
   * @method platform
   * @param useCached {Boolean} Flag: indicates whether to use already cached value or not.
   * @return {String} Returns device platform ('i-phone', 'i-pad', 'android-phone', 'android-tablet', ...).
   */
  platform: function(useCached) {
    var platform;
    if (useCached === true && (platform = this.get('_cache.platform')) !== null) {
      return platform;
    }

    if (this.windows()) {
      platform = 'windows';
    } else if (this.ios()) {
      platform = 'ios';
    } else if (this.android()) {
      platform = 'android';
    } else if (this.blackberry()) {
      platform = 'blackberry';
    } else if (this.fxos()) {
      platform = 'fxos';
    } else if (this.meego()) {
      platform = 'meego';
    } else {
      platform = '';
    }

    this.set('_cache.platform', platform);

    return platform;
  },

  /**
   * Device type.
   *
   * @method type
   * @param useCached {Boolean} Flag: indicates whether to use already cached value or not.
   * @return {String} Returns device type ('desktop', 'phone', 'tablet', 'tv', ...).
   */
  type: function(useCached) {
    var type;
    if (useCached === true && (type = this.get('_cache.type')) !== null) {
      return type;
    }

    if (this.desktop()) {
      type = 'desktop';
    } else if (this.mobile()) {
      type = 'phone';
    } else if (this.tablet()) {
      type = 'tablet';
    } else if (this.tv()) {
      type = 'tv';
    } else {
      type = '';
    }

    this.set('_cache.type', type);

    return type;
  },

  /**
   * Method to get path prefixes for application resources (such as templates, controllers, ...),
   * related to current platform, device type, and orientation.
   *
   * @method pathPrefixes
   * @param useCached {Boolean} Flag: indicates whether to use already cached value or not.
   * @return {String[]} Returns path prefixes for application resources (such as templates, components...),
   * related to current platform, device type, and orientation.
   */
  pathPrefixes: function(useCached) {
    var currentOrientationPathPrefixes;
    var currentOrientation = this.orientation(useCached);
    if (useCached === true && (currentOrientationPathPrefixes = this.get('_cache.pathPrefixes.' + currentOrientation)) !== null) {
      return currentOrientationPathPrefixes;
    }

    var pathPrefixes = { landscape: [], portrait: [] };
    if (this.desktop()) {
      // No path prefixes for desktop.
      // Cache and return empty array.
      this.set('_cache.pathPrefixes', pathPrefixes);
      currentOrientationPathPrefixes = pathPrefixes[currentOrientation];

      return currentOrientationPathPrefixes;
    }

    var platform = this.platform(useCached);
    var type = this.type(useCached);

    // Path prefix with platform and device type: 'ipad', 'android-tablet', 'windows-phone', etc.
    var pathPrefixWithPlatformAndType = '';
    if (this.ios()) {
      pathPrefixWithPlatformAndType = this.ipad() ? 'ipad' : this.ipod() ? 'ipod' : 'iphone';
    } else if (!(Ember.isBlank(platform) || Ember.isBlank(type))) {
      pathPrefixWithPlatformAndType = platform + '-' + type;
    }

    // Path prefix with device type only: 'tablet', 'phone', 'tv' etc.
    var pathPrefixWithType = type;

    // Path prefix with common type only: 'mobile' for both tablets and phones etc.
    var pathPrefixCommon = this.mobile() || this.tablet() ? 'mobile' : '';

    // Path prefixes without orientation.
    var pathPrefixesWithoutOrientation = [
        pathPrefixWithPlatformAndType,
        pathPrefixWithType,
        pathPrefixCommon
    ].filter(function(pathPrefix) {
      return !Ember.isBlank(pathPrefix);
    });

    // Form resulting path prefixes dictionary with additional prefixes related to orientation:
    // ['prefix1', 'prefix2', ...] -> {
    //   landscape: ['prefix1-landscape', 'prefix1', 'prefix2-landscape', 'prefix2', ...],
    //   portrait: ['prefix1-portrait', 'prefix1', 'prefix2-portrait', 'prefix2', ...]
    // }
    for (var orientation in pathPrefixes) {
      if (!pathPrefixes.hasOwnProperty(orientation)) {
        break;
      }

      for (var i = 0, len = pathPrefixesWithoutOrientation.length; i < len; i++) {
        pathPrefixes[orientation].push(pathPrefixesWithoutOrientation[i] + '-' + orientation);
        pathPrefixes[orientation].push(pathPrefixesWithoutOrientation[i]);
      }
    }

    // Cache and return resulting array.
    this.set('_cache.pathPrefixes', pathPrefixes);
    currentOrientationPathPrefixes = pathPrefixes[currentOrientation];

    return currentOrientationPathPrefixes;
  },

  /**
   * Device service cache.
   *
   * @property {Object} _cache
   * @property {String} _cache.orientation Cached orientation ('portrait' or 'landscape').
   * @property {String} _cache.platform Cached platform ('ios', 'windows', 'android', ...).
   * @property {String} _cache.type Cached device type ('desktop', 'phone', 'tablet', or 'tv').
   * @property {Object} _cache.pathPrefixes Cached path prefixes.
   * @property {String[]} _cache.pathPrefixes.landscape  Cached path prefixes for 'landscape' orientation
   * (for example 'ipad-landscape', 'ipad', 'tablet-landscape', 'tablet', 'mobile-landscape', 'mobile').
   * @property {String[]} _cache.pathPrefixes.portrait  Cached path prefixes for 'portrait' orientation
   * (for example 'ipad-portrait', 'ipad', 'tablet-portrait', 'tablet', 'mobile-portrait', 'mobile').
   */
  _cache: {
    orientation: null,
    platform: null,
    type: null,
    pathPrefixes: {
      landscape: null,
      portrait: null
    }
  },

  /**
   * Handler for 'resize' & 'orientationchange' events.
   *
   * @method _onOrientationChange
   */
  _onOrientationChange: function() {
    var previousOrientation = this.get('_cache.orientation');
    var currentOrientation = this.orientation(false);
    if (previousOrientation !== currentOrientation) {
      this.trigger('orientationchange', { orientation: currentOrientation });
    }
  }
});
