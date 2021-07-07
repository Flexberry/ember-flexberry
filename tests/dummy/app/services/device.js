import $ from 'jquery';
import Device from 'ember-flexberry/services/device';

export default Device.extend({
  /**
    Get current device is phone.

    @method isMobile
    @return {Boolean} Returns true, if device is phone.
  */
  isMobile() {
    return $(window).width() < 480;
  }
});
