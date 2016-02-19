// jscs:disable
// jshint ignore:start
/*
 * Initialization code for jquery.malihu-custom-scrollbar plugin
 * (see https://github.com/malihu/malihu-custom-scrollbar-plugin).
 * This code will add 'flexberry-scrollable-content' css-class to a document body,
 * and then will replace all scrollbars for a custom one in each DOM-element
 * which have 'flexberry-scrollable-content' css-class (including dynamicly rendered elements).
 *
 * To initialize jquery.malihu-custom-scrollbar plugin on dynamicly rendered elements,
 * this code uses jquery.initialize plugin (see https://github.com/adampietrasiak/jquery.initialize).
 */
;(function($) {
  $(window).load(function() {
    // It is impossible to replace all scrollbars in whole web-application automatically,
    // we could only replece them on DOM-elements matching some selectors (which could contain some scrollable content).
    // Lets accept an agreement that each potentially scrollable DOM-element must have 'flexberry-scrollable-content' css-class.
    var scrollableContentClass = 'flexberry-scrollable-content';
    $('body').addClass(scrollableContentClass);

    // Initialize jquery.malihu-custom-scrollbar plugin on it.
    $('.' + scrollableContentClass).mCustomScrollbar({
      // Replace scrollbar on dynamicly rendered DOM-elements matching same selector.
      live: true,

      // Replace both horizontal & vertical scrollbars.
      axis: 'yx',

      // Scroll animation duration in milliseconds.
      scrollInertia: 0,

      // Scrollbar theme.
      theme: 'dark'
    });
  });
})(jQuery);
