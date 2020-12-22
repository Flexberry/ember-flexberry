import Device from 'ember-flexberry/services/device';
import Ember from 'ember';

export default Device.extend({
  /**
    Get current device is phone.

    @method isMobile
    @return {Boolean} Returns true, if device is phone.
  */
  isMobile() {
    return Ember.$(window).width() < 480;
  }
});
