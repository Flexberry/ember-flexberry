/**
  @module ember-flexberry
 */

import Mixin from '@ember/object/mixin';
import $ from 'jquery';

/**
  Mixin contains actions for open and close modal window.

  @example
    ```javascript
    // app/routes/application.js
    import Ember from 'ember';
    import ModalApplicationRouteMixin from 'ember-flexberry/mixins/modal-application-route';

    export default Route.extend(ModalApplicationRouteMixin, {
    ...
    });
    ```

    ```javascript
    // app/components/your-component.js
    ...
    actions: {
      ...
      showMessage() {
        this.sendAction('showMessage', 'message');
      },
      hideMessage() {
        this.sendAction('hideMessage');
      },
      ...
    }
    ...
    ```

    ```handlebars
    <!-- app/templates/components/your-component.hbs -->
    ...
    <button {{action 'showMessage'}}>Show message</button>|<button {{action 'hideMessage'}}>Hide message</button>
    ...
    ```

    ```handlebars
    <!-- app/templates/application.hbs -->
    ...
    {{your-component showMessage='showModalDialog' hideMessage='removeModalDialog'}}
    ...
    {{outlet 'modal'}}
    ...
    ```

    ```handlebars
    <!-- app/templates/message.hbs -->
    <h1>Your message here.</h1>
    ```

  @class ModalApplicationRoute
 */
export default Mixin.create({
  actions: {
    /**
      Action to show modal-dialog by name.

      @method actions.showModalDialog
      @param {String} modalDialogName Template name modal window.
      @param {Object} [data] Data for transfer to modal window.
      @param {Ember.Controller} data.controller [Controller](http://emberjs.com/api/classes/Ember.Controller.html).
      @param {DS.Model} data.model [Model](http://emberjs.com/api/data/classes/DS.Model.html).
      @param {Object} [modalParams] Object with parameters for modal window.
      @param {String} [modalParams.outlet] Outlet name.
      @param {String} [modalParams.view] Template name with outlet.
     */
    showModalDialog(modalDialogName, data, modalParams) {
      modalParams = this._getModalParams(modalParams);
      let params = $.extend({
        into: modalParams.view,
        outlet: modalParams.outlet
      }, data);

      this.render(modalDialogName, params);
    },

    /**
      Action to remove modal outlet on modal-dialog close.

      @method actions.removeModalDialog
      @param {Object} [modalParams] Object with parameters for modal window.
      @param {String} [modalParams.outlet] Outlet name.
      @param {String} [modalParams.view] Template name with outlet.
     */
    removeModalDialog(modalParams) {
      modalParams = this._getModalParams(modalParams);
      this.disconnectOutlet({
        outlet: modalParams.outlet,
        parentView: modalParams.view
      });
    }
  },

  /**
    Validate modalParams object.

    @method _getModalParams
    @param {Object} [modalParams] Object with parameters for modal window.
    @param {String} [modalParams.outlet] Outlet name.
    @param {String} [modalParams.view] Template name with outlet.
    @private
   */
  _getModalParams(modalParams) {
    modalParams = modalParams || {};

    let params = {};
    params.outlet = modalParams.outlet || 'modal';
    params.view = modalParams.view || 'application';
    return params;
  },
});
