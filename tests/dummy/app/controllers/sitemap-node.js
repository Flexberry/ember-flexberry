import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    hideSidebar: function() {
      Ember.$('.ui.sidebar').sidebar('hide');
    },
    subMenuEl(event){ 
      let $this =  $(event.currentTarget).parent().find('.subMenu:first');
      if ($this.hasClass('hidden-menu')) {
        $this.removeClass('hidden-menu');
        $(event.target).parent().find('.item-minus:first').removeClass('hidden-menu');
        $(event.target).parent().find('.item-plus:first').addClass('hidden-menu');
      } else {
        $this.addClass('hidden-menu');
        $(event.target).parent().find('.item-minus:first').addClass('hidden-menu');
        $(event.target).parent().find('.item-plus:first').removeClass('hidden-menu');
      }
    },
  }
});
