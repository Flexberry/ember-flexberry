import Ember from 'ember';
import LoginControllerMixin from 'simple-auth/mixins/login-controller-mixin';

export default Ember.Controller.extend(LoginControllerMixin, {
  content: {},
  authenticator: 'authenticator:custom',
  actions: {
    authenticate: function() {
      var _this = this;
      var credentials = this.getProperties('identification', 'password');
      this.get('session').authenticate('authenticator:custom', credentials)
        .then(null, function(data) {
          _this.set('errorMessage', data.error_description);
        });
    }
  }
});
