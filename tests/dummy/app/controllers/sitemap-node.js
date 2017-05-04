import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    hideSidebar: function() {
      Ember.$('.ui.sidebar').sidebar('hide');
    },
    subMenuEl() { 
      let $this = $('.subMenu:first',$(event.target));
      let $this2 = $(event.target).parent().find('.subMenu:first');
      if ($this.hasClass('hidden-menu')) {
         $this.removeClass('hidden-menu');
          $('.item-minus:first', $(event.target)).removeClass('hidden-menu');
          $('.item-plus:first', $(event.target)).addClass('hidden-menu');
      } else {
         $this.addClass('hidden-menu');
          $('.item-minus:first', $(event.target)).addClass('hidden-menu');
          $('.item-plus:first', $(event.target)).removeClass('hidden-menu');
              }
      if (($this2.hasClass('hidden-menu')) && $this.length == 0) {
          $this2.removeClass('hidden-menu');
            $(event.target).parent().find('.item-minus:first').removeClass('hidden-menu');
            $(event.target).parent().find('.item-plus:first').addClass('hidden-menu');
      }  else {
          $this2.addClass('hidden-menu');
           $(event.target).parent().find('.item-minus:first').addClass('hidden-menu');
           $(event.target).parent().find('.item-plus:first').removeClass('hidden-menu');
              }
    },
  }
});
