import Device from 'ember-flexberry/services/device';
import Ember from 'ember';

export default Device.extend({
  /**
    Get current device is desktop.

    @method isDesktop
    @return {Boolean} Returns true, if device is desktop.
  */
  isDesktop() {
    return this.desktop() || Ember.$(window).width() >= 480;
  },

  /**
    Get current device is phone.

    @method isMobile
    @return {Boolean} Returns true, if device is phone.
  */
  isMobile() {
    return this.mobile() && Ember.$(window).width() < 480;
  }
});

