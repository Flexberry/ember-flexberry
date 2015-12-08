import Ember from 'ember';
import LoginControllerMixin from 'simple-auth/mixins/login-controller-mixin';

export default Ember.Controller.extend(LoginControllerMixin, {
  content: {},
  authenticator: 'authenticator:token',
  actions: {
    authenticate: function() {
      var credentials = this.getProperties('identification', 'password');
      this.get('session').authenticate(this.get('authenticator'), credentials)
        .then(null, (data) => {
          this.set('errorMessage', data.error_description);
        });
    }
  }
});
