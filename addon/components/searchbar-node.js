import Component from "@ember/component";

export default Component.extend({  
  click(e) {
    if (!e.target.href) {
      e.stopPropagation();
    }
  }
});
