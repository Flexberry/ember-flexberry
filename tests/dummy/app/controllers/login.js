import Controller from '@ember/controller';

/**
  Коннтрллер логин-формы.

  @class LoginController
  @extends <a href="http://emberjs.com/api/classes/Ember.Controller.html">Ember.Controller</a>
*/
export default Controller.extend({

  actions: {

    /**
      Обработчик события 'submit' логин-формы.

      @method onLoginFormSubmit.login
    */
    onLoginFormSubmit() {
      this.transitionToRoute('index');
    }
  },
});
