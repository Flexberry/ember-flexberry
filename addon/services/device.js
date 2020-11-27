/**
  @module ember-flexberry
*/

import Ember from 'ember';

/**
  Devices detection service.
  Uses <a href="https://github.com/matthewhudson/device.js">devicejs</a> with noConflict,
  duplicates all <a href="https://github.com/matthewhudson/device.js">devicejs</a> methods inside service & implements some new methods.

  @class DeviceService
  @extends <a href="http://emberjs.com/api/classes/Ember.Service.html">Ember.Service</a>
*/
export default Ember.Service.extend(Ember.Evented, {
  /**
    If set as `true`, into prefixes for paths, returned by `pathPrefixes` function, will be added prefix in format: 'platformName-deviceType'.

    @property prefixForPlatformAndType
    @type Boolean
    @default false
  */
  prefixForPlatformAndType: false,

  /**
    If set as `true`, each prefix for paths, returned by `pathPrefixes` function, will be duplicated in format: 'prefix-currentOrientation'.

    @property prefixForOrientation
    @type Boolean
    @default false
  */
  prefixForOrientation: false,

  /**
    If set as `true`, into prefixes for paths, returned by `pathPrefixes` function, will be added prefix in format: 'deviceType'.

    @property prefixForType
    @type Boolean
    @default false
  */
  prefixForType: false,

  /**
    Device service cache.

    @property {Object} _cache
    @property {String} _cache.orientation Cached orientation ('portrait' or 'landscape').
    @property {String} _cache.platform Cached platform ('ios', 'windows', 'android', ...).
    @property {String} _cache.type Cached device type ('desktop', 'phone', 'tablet', or 'tv').
    @property {Object} _cache.pathPrefixes Cached path prefixes.
    @property {String[]} _cache.pathPrefixes.landscape  Cached path prefixes for 'landscape' orientation
    (for example 'ipad-landscape', 'ipad', 'tablet-landscape', 'tablet', 'mobile-landscape', 'mobile').
    @property {String[]} _cache.pathPrefixes.portrait  Cached path prefixes for 'portrait' orientation
    (for example 'ipad-portrait', 'ipad', 'tablet-portrait', 'tablet', 'mobile-portrait', 'mobile').
    @private
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
    Initializes service.
  */
  init() {
    this._super(...arguments);

    let devicejs = window.device;
    if (devicejs) {
      // Names of devicejs library features.
      let devicejsPropertiesNames = Object.keys(devicejs);

      // Inject devicejs library features into service.
      for (let i = 0, len = devicejsPropertiesNames.length; i < len; i++) {
        let propertieName = devicejsPropertiesNames[i];
        this.set(propertieName, devicejs[propertieName]);
      }

      let app = Ember.getOwner(this).application;
      if (app.deviceService) {
        this.set('prefixForType', !!app.deviceService.prefixForType);
        this.set('prefixForOrientation', !!app.deviceService.prefixForOrientation);
        this.set('prefixForPlatformAndType', !!app.deviceService.prefixForPlatformAndType);
      }

      // Attach orientation change handler.
      this.set('_onOrientationChange', this._onOrientationChange.bind(this));
      Ember.$(window).on('resize orientationchange', this._onOrientationChange);
    } else {
      throw new Error('Device service error. Can\'t find device.js entry point.');
    }
  },

  /**
    Get current device is desktop.

    @method isDesktop
    @return {Boolean} Returns true, if device is desktop.
  */
  isDesktop() {
    return this.desktop();
  },

  /**
    Get current device is phone.

    @method isMobile
    @return {Boolean} Returns true, if device is phone.
  */
  isMobile() {
    return this.mobile();
  },

  /**
    Destroys service.
  */
  willDestroy() {
    this._super(...arguments);

    Ember.$(window).off('resize orientationchange', this._onOrientationChange);
  },

  /**
    Returns current device orientation.

    @method orientation
    @param useCached {Boolean} Flag: indicates whether to use already cached value or not.
    @return {String} Returns current device orientation ('landscape' or 'portrait').
  */
  orientation(useCached) {
    let orientation;
    if (useCached === true && (orientation = this.get('_cache.orientation')) !== null) {
      return orientation;
    }

    orientation = this.portrait() ? 'portrait' : 'landscape';
    this.set('_cache.orientation', orientation);

    return orientation;
  },

  /**
    Returns current device platform.

    @method platform
    @param useCached {Boolean} Flag: indicates whether to use already cached value or not.
    @return {String} Returns device platform ('windows', ios', 'android', 'blackberry', 'fxos', 'meego', ...).
  */
  platform(useCached) {
    let platform;
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
    Returns current device type.

    @method type
    @param useCached {Boolean} Flag: indicates whether to use already cached value or not.
    @return {String} Returns device type ('desktop', 'phone', 'tablet', 'tv', ...).
  */
  type(useCached) {
    let type;
    if (useCached === true && (type = this.get('_cache.type')) !== null) {
      return type;
    }

    if (this.isDesktop()) {
      type = 'desktop';
    } else if (this.isMobile()) {
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
    Returns path prefixes for application resources (such as templates, controllers, ...),
    related to current device platform, type, and orientation.

    @method pathPrefixes
    @param useCached {Boolean} Flag: indicates whether to use already cached value or not.
    @return {String[]} Path prefixes for application resources (such as templates, components...),
    related to current platform, device type, and orientation.
  */
  pathPrefixes(useCached) {
    let currentOrientationPathPrefixes;
    let currentOrientation = this.orientation(useCached);

    // Return already cached prefixes.
    if (useCached === true && (currentOrientationPathPrefixes = this.get('_cache.pathPrefixes.' + currentOrientation)) !== null) {
      return currentOrientationPathPrefixes;
    }

    let pathPrefixes = { landscape: [], portrait: [] };
    if (this.isDesktop()) {
      // No path prefixes for desktop.
      // Cache and return empty array.
      this.set('_cache.pathPrefixes', pathPrefixes);
      currentOrientationPathPrefixes = pathPrefixes[currentOrientation];

      return currentOrientationPathPrefixes;
    }

    let platform = this.platform(useCached);
    let type = this.type(useCached);

    // Path prefix with platform and device type: 'ipad', 'android-tablet', 'windows-phone', etc.
    let pathPrefixWithPlatformAndType = '';
    if (this.get('prefixForPlatformAndType')) {
      if (this.ios()) {
        pathPrefixWithPlatformAndType = this.ipad() ? 'ipad' : this.ipod() ? 'ipod' : 'iphone';
      } else if (!(Ember.isBlank(platform) || Ember.isBlank(type))) {
        pathPrefixWithPlatformAndType = platform + '-' + type;
      }
    }

    // Path prefix with device type only: 'tablet', 'phone', 'tv' etc.
    let pathPrefixWithType;
    if (this.get('prefixForType')) {
      pathPrefixWithType = type;
    }

    // Path prefix with common type only: 'mobile' for both tablets and phones etc.
    let pathPrefixCommon = this.isMobile() ? 'mobile' : '';

    // Path prefixes without orientation.
    let pathPrefixesWithoutOrientation = [
        pathPrefixWithPlatformAndType,
        pathPrefixWithType,
        pathPrefixCommon
    ].filter((pathPrefix) => {
      return !Ember.isBlank(pathPrefix);
    });

    // Form resulting path prefixes dictionary with additional prefixes related to orientation:
    // ['prefix1', 'prefix2', ...] -> {
    //   landscape: ['prefix1-landscape', 'prefix1', 'prefix2-landscape', 'prefix2', ...],
    //   portrait: ['prefix1-portrait', 'prefix1', 'prefix2-portrait', 'prefix2', ...]
    // }
    for (let orientation in pathPrefixes) {
      if (!pathPrefixes.hasOwnProperty(orientation)) {
        break;
      }

      for (let i = 0, len = pathPrefixesWithoutOrientation.length; i < len; i++) {
        if (this.get('prefixForOrientation')) {
          pathPrefixes[orientation].push(pathPrefixesWithoutOrientation[i] + '-' + orientation);
        }

        pathPrefixes[orientation].push(pathPrefixesWithoutOrientation[i]);
      }
    }

    // Cache and return resulting array.
    this.set('_cache.pathPrefixes', pathPrefixes);
    currentOrientationPathPrefixes = pathPrefixes[currentOrientation];

    return currentOrientationPathPrefixes;
  },

  /**
    Handles window's 'resize' & 'orientationchange' events.

    @method _onOrientationChange
    @private
  */
  _onOrientationChange: function() {
    let previousOrientation = this.get('_cache.orientation');
    let currentOrientation = this.orientation(false);
    if (previousOrientation !== currentOrientation) {
      this.trigger('orientationchange', { orientation: currentOrientation });
    }
  }
});
