import Ember from 'ember';
import ApplicationRoute from 'ember-flexberry/routes/application';
import AuthApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';
import ModalApplicationRouteMixin from 'ember-flexberry/mixins/modal-application-route';

export default ApplicationRoute.extend(ModalApplicationRouteMixin, AuthApplicationRouteMixin, {
  actions: {
    invalidateSession: function() {
      this.get('session').invalidate();
    },
    openDevCommit: function() {
      let $el = Ember.$('#app-version');
      let version = $el[0].innerText.trim();
      let commitSha = version.split('+')[1];
      window.location.href = 'https://github.com/Flexberry/ember-flexberry/commit/' + commitSha;
    }
  }
});
