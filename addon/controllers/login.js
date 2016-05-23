import Ember from 'ember';

export default Ember.Controller.extend({
  session: Ember.inject.service('session'),
  authenticator: 'authenticator:token',
  actions: {
    authenticate: function() {
      let { identification, password } = this.getProperties('identification', 'password');
      this.get('session').authenticate(this.get('authenticator'), identification, password)
        .catch((reason) => {
          this.set('errorMessage', reason.error_description);
        });
    }
  }
});
