import Ember from 'ember';

export default Ember.Component.extend({
  didInsertElement: function() {
      var _this = this;
	  this.$('.ui.modal').modal("setting", {
        onApprove: function () {
            _this.sendAction('ok');
        },
		onDeny: function () {
            _this.sendAction('close');
        },
		onHidden: function () {
            _this.sendAction('close');
        }
      }).modal('show');
    }
});
