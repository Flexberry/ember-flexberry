import Route from '@ember/routing/route';
const { $, run } = Ember;
const { next } = run;

export default Route.extend({
  activate() {
    this._super();
    next(this, function(){
      $('.main.menu.ui.sidebar').css('cssText', `display: none !important;`);
      $('.full.height').css('margin-left', 0);
    });
  },

  deactivate() {
    this._super();
    $('.main.menu.ui.sidebar').css('display', '');
    $('.full.height').css('margin-left', '');
  }
});
