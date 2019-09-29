import Ember from 'ember';

/**
  Коннтрллер логин-формы.

  @class LoginController
  @extends <a href="http://emberjs.com/api/classes/Ember.Controller.html">Ember.Controller</a>
*/
export default Ember.Controller.extend({

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
