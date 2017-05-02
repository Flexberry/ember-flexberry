import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    hideSidebar: function() {
      Ember.$('.ui.sidebar').sidebar('hide');
    },
    
    subMenuEl() {
    let $this =  $(".subMenu:first", $(event.target));
    if ($this.hasClass('hidden-menu')) {
        $this.removeClass('hidden-menu');
        $(".item-minus:first", $(event.target)).removeClass("hidden-menu");
     	$(".item-plus:first", $(event.target)).addClass("hidden-menu");
        } else {
           $this.addClass("hidden-menu");
            $(".item-minus:first", $(event.target)).addClass("hidden-menu");
            $(".item-plus:first", $(event.target)).removeClass("hidden-menu") }
  },
  }
});
