import Ember from 'ember';
import ModalApplicationRouteMixin from 'ember-flexberry/mixins/modal-application-route';

export default Ember.Route.extend(ModalApplicationRouteMixin, {
  actions: {
    openDevCommit: function() {
      let $el = Ember.$('#app-version');
      let version = $el[0].innerText.trim();
      let commitSha = version.split('+')[1];
      window.location.href = 'https://github.com/Flexberry/ember-flexberry/commit/' + commitSha;
    }
  }
});
