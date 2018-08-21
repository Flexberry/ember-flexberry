/**
  @module ember-flexberry
*/

import Ember from 'ember';

/**
  Service for managing the state of the application.
  By default, to display application states, the states in [Form Semantic UI](https://semantic-ui.com/collections/form.html) are used.

  ### Usage example

  1. Add a service to the application controller.

  ```javascript
  // app/controllers/application.js
  import Controller from '@ember/controller';
  import { inject as service } from '@ember/service';

  export default Controller.extend({
    appState: service(),
  });
  ```

  2. Use the application state in the template.

  ```handlebars
  <div class="ui {{appState.state}} form">
    {{outlet}}
  </div>
  ```

  3. Use the service in another controller (or component).

  ```javascript
  // app/controllers/my-controller.js
  import Controller from '@ember/controller';
  import { inject as service } from '@ember/service';

  export default Controller.extend({
    appState: service(),

    actions: {
      load() {
        this.get('appState').loading();
        this.load().finally(() => {
          this.get('appState').reset();
        });
      },
    },
  });
  ```

  @class AppStateService
  @extends <a href="http://emberjs.com/api/classes/Ember.Service.html">Ember.Service</a>
*/
export default Ember.Service.extend({
  /**
    @private
    @property state
    @type String
    @default ''
  */
  _state: '',

  /**
    The application state.

    @property state
    @readOnly
    @type String
  */
  state: Ember.computed.readOnly('_state'),

  /**
    Sets the application state as `loading`.

    @method loading
  */
  loading() {
    this.set('_state', 'loading');
  },

  /**
    Sets the application state as `success`.

    @method success
  */
  success() {
    this.set('_state', 'success');
  },

  /**
    Sets the application state as `error`.

    @method error
  */
  error() {
    this.set('_state', 'error');
  },

  /**
    Sets the application state as `warning`.

    @method warning
  */
  warning() {
    this.set('_state', 'warning');
  },

  /**
    Sets the application state to the default value.

    @method reset
  */
  reset() {
    this.set('_state', '');
  },
});
