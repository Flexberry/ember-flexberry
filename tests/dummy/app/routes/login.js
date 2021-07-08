import Route from '@ember/routing/route';
import $ from 'jquery';
import { run } from '@ember/runloop';

export default Route.extend({
  activate() {
    this._super();
    run.next(this, function(){
      $('.main.menu.ui.sidebar').css('cssText', `display: none !important;`);
      $('.full.height').css('margin-left', 0);
      $('.page-header-userbar').css('display', 'none');
      $('.sidebar.icon').css('display', 'none');
    });
  },

  deactivate() {
    this._super();
    $('.main.menu.ui.sidebar').css('display', '');
    $('.full.height').css('margin-left', '');
    $('.page-header-userbar').css('display', '');
    $('.sidebar.icon').css('display', '');
  }
});
