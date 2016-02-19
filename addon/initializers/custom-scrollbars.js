/**
 * @module ember-flexberry
 */

import Ember from 'ember';

/**
 * Application initializer that initializes application custom scrollbars.
 * (see https://github.com/malihu/malihu-custom-scrollbar-plugin).
 * This code will add 'flexberry-scrollable-content' css-class to a document body,
 * and then will replace all scrollbars with a custom ones in each DOM-element
 * which have 'flexberry-scrollable-content' css-class (including dynamically rendered elements).
 */
export function initialize(application) {
  // Application configuration defined options (APP.customScrollbars in configuration/environment.js);
  var customScrollbarsConfig = application.customScrollbars || {};

  // Do not replace scrollbars with custom if custom scrollbars are disabled in application configuration.
  if (customScrollbarsConfig.enable === false) {
    return;
  }

  // Defaults for jquery.malihu-custom-scrollbar plugin.
  var options = {
    // Replace both horizontal & vertical scrollbars.
    axis: 'yx',

    // Scroll animation duration in milliseconds.
    scrollInertia: 0,

    // Scrollbar theme.
    theme: 'dark'
  };

  // Extend defaults with application configuration defined options (APP.customScrollbars in configuration/environment.js);
  Ember.$.extend(true, options, customScrollbarsConfig);

  // Define this options after extending defaults to avoid overriding
  // ('live' option should be always true and 'liveSelector' should be always undefined).
  options.live = true;
  options.liveSelector = undefined;

  // It is impossible to replace all scrollbars in whole web-application automatically,
  // we could only replece them on DOM-elements matching some selectors (which could contain some scrollable content).
  // Lets accept an agreement that each potentially scrollable DOM-element must have 'flexberry-scrollable-content' css-class.
  var scrollableContentClass = 'flexberry-scrollable-content';

  Ember.$(window).load(function() {
    // Mark document body as scrollable content.
    Ember.$('body').addClass(scrollableContentClass);

    // Initialize jquery.malihu-custom-scrollbar plugin on DOM-elements with 'flexberry-scrollable-content' css-class
    // (including dynamically rendered elements matching same selector).
    Ember.$('.' + scrollableContentClass).mCustomScrollbar(options);
  });
}

export default {
  name: 'scrollbars',
  initialize: initialize
};
