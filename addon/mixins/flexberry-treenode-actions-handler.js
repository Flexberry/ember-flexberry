/**
  @module ember-flexberry
*/

import Ember from 'ember';

/**
  Mixin containing handlers for
  {{#crossLink "FlexberryTreenodeComponent"}}flexberry-treenode component's{{/crossLink}} actions.

  @class FlexberryTreenodeActionsHandlerMixin
  @extends <a href="http://emberjs.com/api/classes/Ember.Mixin.html">Ember.Mixin</a>
*/
export default Ember.Mixin.create({
  actions: {
    /**
      Handles {{#crossLink "FlexberryTreenodeComponent/sendingActions.headerClick:method"}}flexberry-treenode component's 'headerClick' action{{/crossLink}}.

      @method actions.onTreenodeHeaderClick
      @param {Object} e Action's event object.
      @param {Object} e.originalEvent [jQuery event object](http://api.jquery.com/category/events/event-object/)
      which describes event that triggers node's 'headerClick' action.

      @example
      templates/my-form.hbs
      ```handlebars
        {{flexberry-treenode
          caption="Tree node"
          headerClick=(action "onTreenodeHeaderClick")
        }}
      ```

      controllers/my-form.js
      ```javascript
        import Ember from 'ember';
        import FlexberryTreenodeActionsHandlerMixin from 'ember-flexberry/mixins/flexberry-treenode-actions-handler';

        export default Ember.Controller.extend(FlexberryTreenodeActionsHandlerMixin, {
        });
      ```
    */
    onTreenodeHeaderClick(...args) {
    },

    /**
      Handles {{#crossLink "FlexberryTreenodeComponent/sendingActions.beforeExpand:method"}}flexberry-treenode component's 'beforeExpand' action{{/crossLink}}.

      @method actions.onTreenodeBeforeExpand
      @param {Object} e Action's event object.
      @param {Object} e.originalEvent [jQuery event object](http://api.jquery.com/category/events/event-object/)
      which describes event that triggers node's expanding.

      @example
      templates/my-form.hbs
      ```handlebars
        {{flexberry-treenode
          caption="Tree node"
          beforeExpand=(action "onTreenodeBeforeExpand")
        }}
      ```

      controllers/my-form.js
      ```javascript
        import Ember from 'ember';
        import FlexberryTreenodeActionsHandlerMixin from 'ember-flexberry/mixins/flexberry-treenode-actions-handler';

        export default Ember.Controller.extend(FlexberryTreenodeActionsHandlerMixin, {
        });
      ```
    */
    onTreenodeBeforeExpand(...args) {
    },

    /**
      Handles {{#crossLink "FlexberryTreenodeComponent/sendingActions.beforeCollapse:method"}}flexberry-treenode component's 'beforeCollapse' action{{/crossLink}}.

      @method actions.onTreenodeBeforeCollapse
      @param {Object} e Action's event object.
      @param {Object} e.originalEvent [jQuery event object](http://api.jquery.com/category/events/event-object/)
      which describes event that triggers node's collapsing.

      @example
      templates/my-form.hbs
      ```handlebars
        {{flexberry-treenode
          caption="Tree node"
          beforeCollapse=(action "onTreenodeBeforeCollapse")
        }}
      ```

      controllers/my-form.js
      ```javascript
        import Ember from 'ember';
        import FlexberryTreenodeActionsHandlerMixin from 'ember-flexberry/mixins/flexberry-treenode-actions-handler';

        export default Ember.Controller.extend(FlexberryTreenodeActionsHandlerMixin, {
        });
      ```
    */
    onTreenodeBeforeCollapse(...args) {
    }
  }
});
