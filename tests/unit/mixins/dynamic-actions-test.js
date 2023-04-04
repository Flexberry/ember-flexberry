import Component from '@ember/component';
import Controller from '@ember/controller';
import { A } from '@ember/array';
import { typeOf } from '@ember/utils';
import DynamicActionsMixin from 'ember-flexberry/mixins/dynamic-actions';
import DynamicActionObject from 'ember-flexberry/objects/dynamic-action';
import { module, test } from 'qunit';

let ComponentWithDynamicActionsMixin = Component.extend(DynamicActionsMixin, {});

module('Unit | Mixin | dynamic-actions mixin', function() {
  test('Mixin throws assertion failed exception if specified \'dynamicActions\' is not array', function (assert) {
    let wrongDynamicActionsArray = A([1, true, false, 'some string', {}, function() {}, new Date(), new RegExp()]);
  
    assert.expect(wrongDynamicActionsArray.length);
  
    wrongDynamicActionsArray.forEach((wrongDynamicActions) => {
      let component = ComponentWithDynamicActionsMixin.create({
        attrs: {},
        dynamicActions: wrongDynamicActions,
        renderer: {}
      });
  
      try {
        component.sendDynamicAction('someAction');
      } catch (ex) {
        assert.strictEqual(
          (/wrong\s*type\s*of\s*.*dynamicActions.*/gi).test(ex.message),
          true,
          'Throws assertion failed exception if specified \'dynamicActions\' property is \'' +
          typeOf(wrongDynamicActions) +
          '\'');
      }
    });
  });
  
  test(
    'Mixin throws assertion failed exception if one of specified \'dynamicActions\' has wrong \'on\' property',
    function (assert) {
      let wrongOnPropertiesArray = A([1, true, false, {}, [], function() {}, new Date(), new RegExp()]);
  
      assert.expect(wrongOnPropertiesArray.length);
  
      wrongOnPropertiesArray.forEach((wrongOnProperty) => {
        let component = ComponentWithDynamicActionsMixin.create({
          attrs: {},
          dynamicActions: A([DynamicActionObject.create({
            on: wrongOnProperty,
            actionHandler: null,
            actionName: null,
            actionContext: null,
            actionArguments: null
          })]),
          renderer: {}
        });
  
        try {
          component.sendDynamicAction('someAction');
        } catch (ex) {
          assert.strictEqual(
            (/wrong\s*type\s*of\s*.*on.*/gi).test(ex.message),
            true,
            'Throws assertion failed exception if one of specified \'dynamicActions\' has \'on\' property of wrong type \'' +
            typeOf(wrongOnProperty) + '\'');
        }
      });
    }
  );
  
  test(
    'Mixin throws assertion failed exception if one of specified \'dynamicActions\' has wrong \'actionHandler\' property',
    function (assert) {
      let wrongActionHandlersArray = A([1, true, false, 'some string', {}, [], new Date(), new RegExp()]);
  
      assert.expect(wrongActionHandlersArray.length);
  
      wrongActionHandlersArray.forEach((wrongActionHandler) => {
        let component = ComponentWithDynamicActionsMixin.create({
          attrs: {},
          dynamicActions: A([DynamicActionObject.create({
            on: 'someAction',
            actionHandler: wrongActionHandler,
            actionName: null,
            actionContext: null,
            actionArguments: null
          })]),
          renderer: {}
        });
  
        try {
          component.sendDynamicAction('someAction');
        } catch (ex) {
          assert.strictEqual(
            (/wrong\s*type\s*of\s*.*actionHandler.*/gi).test(ex.message),
            true,
            'Throws assertion failed exception if one of specified \'dynamicActions\' has \'actionHandler\' property of wrong type \'' +
            typeOf(wrongActionHandler) + '\'');
        }
      });
    }
  );
  
  test(
    'Mixin throws assertion failed exception if one of specified \'dynamicActions\' has wrong \'actionName\' property',
    function (assert) {
      let wrongActionNamesArray = A([1, true, false, {}, [], function() {}, new Date(), new RegExp()]);
  
      assert.expect(wrongActionNamesArray.length);
  
      wrongActionNamesArray.forEach((wrongActionName) => {
        let component = ComponentWithDynamicActionsMixin.create({
          attrs: {},
          dynamicActions: A([DynamicActionObject.create({
            on: 'someAction',
            actionHandler: null,
            actionName: wrongActionName,
            actionContext: null,
            actionArguments: null
          })]),
          renderer: {}
        });
  
        try {
          component.sendDynamicAction('someAction');
        } catch (ex) {
          assert.strictEqual(
            (/wrong\s*type\s*of\s*.*actionName.*/gi).test(ex.message),
            true,
            'Throws assertion failed exception if one of specified \'dynamicActions\' has \'actionName\' property of wrong type \'' +
            typeOf(wrongActionName) + '\'');
        }
      });
    }
  );
  
  test(
    'Mixin throws assertion failed exception if one of specified \'dynamicActions\' has defined \'actionName\', but' +
    ' wrong \'actionContext\' property (without \'send\' method)',
    function (assert) {
      let wrongActionContextsArray = A([null, 1, true, false, {}, [], function() {}, new Date(), new RegExp(), { send: function() {} }]);
  
      // Assertion shouldn't be send for last object containing 'send' method,
      // that's why length - 1.
      assert.expect(wrongActionContextsArray.length - 1);
  
      wrongActionContextsArray.forEach((wrongActionContext) => {
        let component = ComponentWithDynamicActionsMixin.create({
          attrs: {},
          dynamicActions: A([DynamicActionObject.create({
            on: 'someAction',
            actionHandler: null,
            actionName: 'onSomeAction',
            actionContext: wrongActionContext,
            actionArguments: null
          })]),
          renderer: {}
        });
  
        try {
          component.sendDynamicAction('someAction');
        } catch (ex) {
          assert.strictEqual(
            (/method\s*.*send.*\s*.*actionContext.*/gi).test(ex.message),
            true,
            'Throws assertion failed exception if one of specified \'dynamicActions\' has defined \'actionName\', ' +
            'but wrong \'actionContext\' property (without \'send\' method)');
        }
      });
    }
  );
  
  test(
    'Mixin throws assertion failed exception if one of specified \'dynamicActions\' has wrong \'actionArguments\' property',
    function (assert) {
      let wrongActionArgumentsArray = A([1, true, false, 'some string', {}, function() {}, new Date(), new RegExp()]);
  
      assert.expect(wrongActionArgumentsArray.length);
  
      wrongActionArgumentsArray.forEach((wrongActionArguments) => {
        let component = ComponentWithDynamicActionsMixin.create({
          attrs: {},
          dynamicActions: A([DynamicActionObject.create({
            on: 'someAction',
            actionHandler: null,
            actionName: null,
            actionContext: null,
            actionArguments: wrongActionArguments
          })]),
          renderer: {}
        });
  
        try {
          component.sendDynamicAction('someAction');
        } catch (ex) {
          assert.strictEqual(
            (/wrong\s*type\s*of\s*.*actionArguments.*/gi).test(ex.message),
            true,
            'Throws assertion failed exception if one of specified \'dynamicActions\' has \'actionArguments\' property of wrong type \'' +
            typeOf(wrongActionArguments) + '\'');
        }
      });
    }
  );
  
  test('Mixin does\'t break it\'s owner\'s standard \'sendAction\' logic', function (assert) {
    assert.expect(1);
  
    let component = ComponentWithDynamicActionsMixin.create({
      attrs: {},
      dynamicActions: A([DynamicActionObject.create({
        on: 'someAction',
        actionHandler: null,
        actionName: null,
        actionContext: null,
        actionArguments: null
      })]),
      renderer: {}
    });
  
    let someActionHandlerHasBeenCalled = false;
    component.attrs.someAction = function() {
      someActionHandlerHasBeenCalled = true;
    };
  
    component.sendDynamicAction('someAction');
  
    assert.strictEqual(
      someActionHandlerHasBeenCalled,
      true,
      'Component still normally triggers proper action handlers (binded explicitly with ember API, not with dynamic actions)');
  });
  
  test(
    'Mixin triggers specified \'dynamicActions\' handlers (\'actionHandler\' callbacks only) ' +
    'if \'actionContext\' isn\'t specified',
    function (assert) {
      assert.expect(10);
  
      let someActionDynamicHandlerHasBeenCalled = false;
      let someAnotherActionDynamicHandlerHasBeenCalled = false;
      let someActionAgainDynamicHandlerHasBeenCalled = false;
  
      let component = ComponentWithDynamicActionsMixin.create({
        attrs: {},
        dynamicActions: A([DynamicActionObject.create({
          on: 'someAction',
          actionHandler: function() {
            someActionDynamicHandlerHasBeenCalled = true;
          },
          actionName: null,
          actionContext: null,
          actionArguments: null
        }), DynamicActionObject.create({
          on: 'someAnotherAction',
          actionHandler: function() {
            someAnotherActionDynamicHandlerHasBeenCalled = true;
          },
          actionName: null,
          actionContext: null,
          actionArguments: null
        }), DynamicActionObject.create({
          on: 'someAction',
          actionHandler: function() {
            someActionAgainDynamicHandlerHasBeenCalled = true;
          },
          actionName: null,
          actionContext: null,
          actionArguments: null
        })]),
        renderer: {}
      });
  
      let someActionHandlerHasBeenCalled = false;
      component.attrs.someAction = function() {
        someActionHandlerHasBeenCalled = true;
      };
  
      let someAnotherActionHandlerHasBeenCalled = false;
      component.attrs.someAnotherAction = function() {
        someAnotherActionHandlerHasBeenCalled = true;
      };
  
      component.sendDynamicAction('someAction');
      assert.strictEqual(
        someActionHandlerHasBeenCalled,
        true,
        'Component still normally triggers proper action handlers (binded explicitly with ember API, not with dynamic actions)');
      assert.strictEqual(
        someAnotherActionHandlerHasBeenCalled,
        false,
        'Component still normally doesn\'t trigger proper action handlers ' +
        '(binded explicitly with ember API, not with dynamic actions) for yet unsended actions');
  
      assert.strictEqual(
        someActionDynamicHandlerHasBeenCalled,
        true,
        'Component triggers specified in dynamic action \'actionHandler\' for component\'s \'someAction\'');
      assert.strictEqual(
        someAnotherActionDynamicHandlerHasBeenCalled,
        false,
        'Component doesn\'t trigger specified in dynamic action \'actionHandler\' binded to yet unsended \'someAnotherAction\'');
      assert.strictEqual(
        someActionAgainDynamicHandlerHasBeenCalled,
        true,
        'Component triggers specified in dynamic action another \'actionHandler\' for component\'s \'someAction\'');
  
      someActionHandlerHasBeenCalled = false;
      someAnotherActionHandlerHasBeenCalled = false;
      someAnotherActionDynamicHandlerHasBeenCalled = false;
      someActionDynamicHandlerHasBeenCalled = false;
      someActionAgainDynamicHandlerHasBeenCalled = false;
  
      component.sendDynamicAction('someAnotherAction');
      assert.strictEqual(
        someActionHandlerHasBeenCalled,
        false,
        'Component still normally doesn\'t trigger proper action handlers ' +
        '(binded explicitly with ember API, not with dynamic actions) for yet unsended actions');
      assert.strictEqual(
        someAnotherActionHandlerHasBeenCalled,
        true,
        'Component still normally triggers proper action handlers (binded explicitly with ember API, not with dynamic actions)');
  
      assert.strictEqual(
        someActionDynamicHandlerHasBeenCalled,
        false,
        'Component doesn\'t trigger specified in dynamic action \'actionHandler\' binded to yet unsended \'someAction\'');
      assert.strictEqual(
        someAnotherActionDynamicHandlerHasBeenCalled,
        true,
        'Component triggers specified in dynamic action \'actionHandler\' for component\'s \'anotherAction\'');
      assert.strictEqual(
        someActionAgainDynamicHandlerHasBeenCalled,
        false,
        'Component doesn\'t trigger specified in dynamic action \'actionHandler\' binded to yet unsended \'someAction\'');
    }
  );
  
  test(
    'Mixin triggers all specified \'dynamicActions\' handlers (callbacks & normal actions) on given context',
    function (assert) {
      assert.expect(22);
  
      let someActionControllersHandlerHasBeenCalled = false;
      let someActionControllersHandlerContext = null;
  
      let someAnoterActionControllersHandlerHasBeenCalled = false;
      let someAnotherActionControllersHandlerContext = null;
  
      let someActionAgainControllersHandlerHasBeenCalled = false;
      let someActionAgainControllersHandlerContext = null;
  
      let controller = Controller.extend({
        actions: {
          onSomeAction: function() {
            someActionControllersHandlerHasBeenCalled = true;
            someActionControllersHandlerContext = this;
          },
  
          onSomeAnotherAction: function() {
            someAnoterActionControllersHandlerHasBeenCalled = true;
            someAnotherActionControllersHandlerContext = this;
          },
  
          onSomeActionAgain: function() {
            someActionAgainControllersHandlerHasBeenCalled = true;
            someActionAgainControllersHandlerContext = this;
          }
        }
      }).create();
  
      let someActionDynamicHandlerHasBeenCalled = false;
      let someActionDynamicHandlerContext = null;
  
      let someAnotherActionDynamicHandlerHasBeenCalled = false;
      let someAnotherActionDynamicHandlerContext = null;
  
      let someActionAgainDynamicHandlerHasBeenCalled = false;
      let someActionAgainDynamicHandlerContext = null;
  
      let component = ComponentWithDynamicActionsMixin.create({
        attrs: {},
        dynamicActions: A([DynamicActionObject.create({
          on: 'someAction',
          actionHandler: function() {
            someActionDynamicHandlerHasBeenCalled = true;
            someActionDynamicHandlerContext = this;
          },
          actionName: 'onSomeAction',
          actionContext: controller,
          actionArguments: null
        }), DynamicActionObject.create({
          on: 'someAnotherAction',
          actionHandler: function() {
            someAnotherActionDynamicHandlerHasBeenCalled = true;
            someAnotherActionDynamicHandlerContext = this;
          },
          actionName: 'onSomeAnotherAction',
          actionContext: controller,
          actionArguments: null
        }), DynamicActionObject.create({
          on: 'someAction',
          actionHandler: function() {
            someActionAgainDynamicHandlerHasBeenCalled = true;
            someActionAgainDynamicHandlerContext = this;
          },
          actionName: 'onSomeActionAgain',
          actionContext: controller,
          actionArguments: null
        })]),
        renderer: {}
      });
  
      let someActionHandlerHasBeenCalled = false;
      component.attrs.someAction = function() {
        someActionHandlerHasBeenCalled = true;
      };
  
      let someAnotherActionHandlerHasBeenCalled = false;
      component.attrs.someAnotherAction = function() {
        someAnotherActionHandlerHasBeenCalled = true;
      };
  
      component.sendDynamicAction('someAction');
      assert.strictEqual(
        someActionHandlerHasBeenCalled,
        true,
        'Component still normally triggers proper action handlers (binded explicitly with ember API, not with dynamic actions)');
      assert.strictEqual(
        someAnotherActionHandlerHasBeenCalled,
        false,
        'Component still normally doesn\'t trigger proper action handlers ' +
        '(binded explicitly with ember API, not with dynamic actions) for yet unsended actions');
  
      assert.strictEqual(
        someActionDynamicHandlerHasBeenCalled,
        true,
        'Component triggers specified in dynamic action \'actionHandler\' for component\'s \'someAction\'');
      assert.strictEqual(
        someActionDynamicHandlerContext,
        controller,
        'Component triggers specified in dynamic action \'actionHandler\' for ' +
        'component\'s \'someAction\' with specified \'actionContext\'');
      assert.strictEqual(
        someAnotherActionDynamicHandlerHasBeenCalled,
        false,
        'Component doesn\'t trigger specified in dynamic action \'actionHandler\' binded to ' +
        'yet unsended \'someAnotherAction\'');
      assert.strictEqual(
        someActionAgainDynamicHandlerHasBeenCalled,
        true,
        'Component triggers specified in dynamic action another \'actionHandler\' for component\'s \'someAction\'');
      assert.strictEqual(
        someActionAgainDynamicHandlerContext,
        controller,
        'Component triggers specified in dynamic action \'actionHandler\' for ' +
        'component\'s \'someAction\' with specified \'actionContext\'');
  
      assert.strictEqual(
        someActionControllersHandlerHasBeenCalled,
        true,
        'Component triggers on given \'actionContext\' action with specified \'actionName\' for component\'s \'someAction\'');
      assert.strictEqual(
        someActionControllersHandlerContext,
        controller,
        'Component triggers on given \'actionContext\' action with specified \'actionName\' for ' +
        'component\'s \'someAction\' with specified \'actionContext\'');
      assert.strictEqual(
        someAnotherActionDynamicHandlerHasBeenCalled,
        false,
        'Component doesn\'t trigger specified in dynamic action \'actionHandler\' binded to yet unsended \'someAnotherAction\'');
      assert.strictEqual(
        someActionAgainControllersHandlerHasBeenCalled,
        true,
        'Component triggers on given \'actionContext\' action with specified \'actionName\' for component\'s \'someAction\'');
      assert.strictEqual(
        someActionAgainControllersHandlerContext,
        controller,
        'Component triggers on given \'actionContext\' action with specified \'actionName\' for ' +
        'component\'s \'someAction\' with specified \'actionContext\'');
  
      someActionHandlerHasBeenCalled = false;
      someAnotherActionHandlerHasBeenCalled = false;
  
      someActionDynamicHandlerHasBeenCalled = false;
      someActionDynamicHandlerContext = null;
  
      someAnotherActionDynamicHandlerHasBeenCalled = false;
      someAnotherActionDynamicHandlerContext = null;
  
      someActionAgainDynamicHandlerHasBeenCalled = false;
      someActionAgainDynamicHandlerContext = null;
  
      someActionControllersHandlerHasBeenCalled = false;
      someActionControllersHandlerContext = null;
  
      someAnoterActionControllersHandlerHasBeenCalled = false;
      someAnotherActionControllersHandlerContext = null;
  
      someActionAgainControllersHandlerHasBeenCalled = false;
      someActionAgainControllersHandlerContext = null;
  
      component.sendDynamicAction('someAnotherAction');
      assert.strictEqual(
        someActionHandlerHasBeenCalled,
        false,
        'Component still normally doesn\'t trigger proper action handlers ' +
        '(binded explicitly with ember API, not with dynamic actions) for yet unsended actions');
      assert.strictEqual(
        someAnotherActionHandlerHasBeenCalled,
        true,
        'Component still normally triggers proper action handlers ' +
        '(binded explicitly with ember API, not with dynamic actions)');
  
      assert.strictEqual(
        someActionDynamicHandlerHasBeenCalled,
        false,
        'Component doesn\'t trigger specified in dynamic action \'actionHandler\' binded to yet unsended \'someAction\'');
      assert.strictEqual(
        someAnotherActionDynamicHandlerHasBeenCalled,
        true,
        'Component doesn\'t trigger specified in dynamic action \'actionHandler\' binded to yet unsended \'someAnotherAction\'');
      assert.strictEqual(
        someAnotherActionDynamicHandlerContext,
        controller,
        'Component triggers specified in dynamic action \'actionHandler\' for ' +
        'component\'s \'someAnotherAction\' with specified \'actionContext\'');
      assert.strictEqual(
        someActionAgainDynamicHandlerHasBeenCalled,
        false,
        'Component doesn\'t trigger specified in dynamic action \'actionHandler\' binded ' +
        'to yet unsended \'someAction\'');
  
      assert.strictEqual(
        someActionControllersHandlerHasBeenCalled,
        false,
        'Component doesn\'t trigger on given \'actionContext\' action with specified \'actionName\' binded ' +
        'to yet unsended \'someAction\'');
      assert.strictEqual(
        someAnoterActionControllersHandlerHasBeenCalled,
        true,
        'Component triggers on given \'actionContext\' action with specified \'actionName\' for ' +
        'component\'s \'someAnotherAction\'');
      assert.strictEqual(
        someAnotherActionControllersHandlerContext,
        controller,
        'Component triggers on given \'actionContext\' action with specified \'actionName\' for ' +
        'component\'s \'someAnotherAction\' with specified \'actionContext\'');
      assert.strictEqual(
        someActionAgainControllersHandlerHasBeenCalled,
        false,
        'Component doesn\'t trigger on given \'actionContext\' action with specified \'actionName\' binded to ' +
        'yet unsended \'someAction\'');
    }
  );
  
  test('Mixin works properly with \'dynamicActions\' added/removed after component initialization', function (assert) {
    assert.expect(8);
  
    // Define component without any dynamic actions.
    let dynamicActions = A();
    let component = ComponentWithDynamicActionsMixin.create({
      attrs: {},
      dynamicActions: dynamicActions,
      renderer: {}
    });
  
    // Define controller.
    let someActionControllersHandlerHasBeenCalled = false;
    let someActionControllersHandlerContext = null;
    let controller = Controller.extend({
      actions: {
        onSomeAction: function() {
          someActionControllersHandlerHasBeenCalled = true;
          someActionControllersHandlerContext = this;
        }
      }
    }).create();
  
    // Define dynamic action.
    let someActionDynamicHandlerHasBeenCalled = false;
    let someActionDynamicHandlerContext = null;
    let someDynamicAction = DynamicActionObject.create({
      on: 'someAction',
      actionHandler: function() {
        someActionDynamicHandlerHasBeenCalled = true;
        someActionDynamicHandlerContext = this;
      },
      actionName: 'onSomeAction',
      actionContext: controller,
      actionArguments: null
    });
  
    let someActionHandlerHasBeenCalled = false;
    component.attrs.someAction = function() {
      someActionHandlerHasBeenCalled = true;
    };
  
    // Add defined dynamic action to a component after it has been already initialized.
    dynamicActions.pushObject(someDynamicAction);
  
    // Check that all handlers were called with expected context.
    component.sendDynamicAction('someAction');
    assert.strictEqual(
      someActionHandlerHasBeenCalled,
      true,
      'Component still normally triggers proper action handlers (binded explicitly with ember API, not with dynamic actions)');
    assert.strictEqual(
      someActionDynamicHandlerHasBeenCalled,
      true,
      'Component triggers specified in added dynamic action \'actionHandler\' for component\'s \'someAction\'');
    assert.strictEqual(
      someActionDynamicHandlerContext,
      controller,
      'Component triggers specified in added dynamic action \'actionHandler\' for ' +
      'component\'s \'someAction\' with specified \'actionContext\'');
    assert.strictEqual(
      someActionControllersHandlerHasBeenCalled,
      true,
      'Component triggers on added dynamic action\'s \'actionContext\' action with specified \'actionName\' for ' +
      'component\'s \'someAction\'');
    assert.strictEqual(
      someActionControllersHandlerContext,
      controller,
      'Component triggers on added dynamic action\'s \'actionContext\' action with specified \'actionName\' for ' +
      'component\'s \'someAction\' with specified \'actionContext\'');
  
    someActionHandlerHasBeenCalled = false;
    someActionDynamicHandlerHasBeenCalled = false;
    someActionDynamicHandlerContext = false;
    someActionControllersHandlerHasBeenCalled = false;
    someActionControllersHandlerContext = false;
  
    // Remove defined dynamic action to a component after it has been already initialized.
    dynamicActions.removeObject(someDynamicAction);
    component.sendDynamicAction('someAction');
    assert.strictEqual(
      someActionHandlerHasBeenCalled,
      true,
      'Component still normally triggers proper action handlers (binded explicitly with ember API, not with dynamic actions)');
    assert.strictEqual(
      someActionDynamicHandlerHasBeenCalled,
      false,
      'Component doesn\'t trigger specified in removed dynamic action \'actionHandler\' for component\'s \'someAction\'');
    assert.strictEqual(
      someActionControllersHandlerHasBeenCalled,
      false,
      'Component doesn\'t trigger on removed dynamic action\'s \'actionContext\' action with specified \'actionName\' for ' +
      'component\'s \'someAction\'');
  });
  
  test(
    'Mixin adds specified in \'dynamicActions\' \'actionArguments\' to the beginning of handler\'s arguments array',
    function (assert) {
      assert.expect(3);
  
      let dynamicActionArguments = A(['firstDynamicArgument', 'secondDynamicArgument']);
  
      let someActionHandlerArguments = null;
      let someActionDynamicHandlerArguments = null;
      let someActionDynamicControllersHandlerArguments = null;
  
      let controller = Controller.extend({
        actions: {
          onSomeAction: function(...args) {
            someActionDynamicControllersHandlerArguments = A(args);
          }
        }
      }).create();
  
      let component = ComponentWithDynamicActionsMixin.create({
        attrs: {},
        dynamicActions: A([DynamicActionObject.create({
          on: 'someAction',
          actionHandler: function(...args) {
            someActionDynamicHandlerArguments = A(args);
          },
          actionName: 'onSomeAction',
          actionContext: controller,
          actionArguments: dynamicActionArguments
        })]),
        renderer: {}
      });
  
      component.attrs.someAction = function(...args) {
        someActionHandlerArguments = A(args);
      };
  
      // Check that all handlers were called with expected arguments.
      let originalActionArguments = A(['firstOriginalArgument', 'secondOriginalArgument']);
      component.sendDynamicAction('someAction', ...originalActionArguments);
      assert.strictEqual(
        someActionHandlerArguments[0] === originalActionArguments[0] &&
        someActionHandlerArguments[1] === originalActionArguments[1],
        true,
        'Component\'s original action handler doesn\'t contain additional \'actionArguments\' from \'dynamicActions\' (only original arguments)');
      assert.strictEqual(
        someActionDynamicHandlerArguments[0] === dynamicActionArguments[0] &&
        someActionDynamicHandlerArguments[1] === dynamicActionArguments[1] &&
        someActionDynamicHandlerArguments[2] === originalActionArguments[0] &&
        someActionDynamicHandlerArguments[3] === originalActionArguments[1],
        true,
        'Component\'s dynamic action handler contains additional \'actionArguments\' from \'dynamicActions\'');
      assert.strictEqual(
        someActionDynamicControllersHandlerArguments[0] === dynamicActionArguments[0] &&
        someActionDynamicControllersHandlerArguments[1] === dynamicActionArguments[1] &&
        someActionDynamicControllersHandlerArguments[2] === originalActionArguments[0] &&
        someActionDynamicControllersHandlerArguments[3] === originalActionArguments[1],
        true,
        'Action handler with specified \'actionName\' contains additional \'actionArguments\' from \'dynamicActions\'');
    }
  );
  
  test('Mixin doesn\'t trigger component\'s inner method if outer action handler is not defined', function (assert) {
    assert.expect(2);
  
    let component = ComponentWithDynamicActionsMixin.create({
      attrs: {},
      renderer: {}
    });
  
    let innerSomeActionHasBeenCalled = false;
    component.someAction = function() {
      innerSomeActionHasBeenCalled = true;
    };
  
    component.sendDynamicAction('someAction');
    assert.strictEqual(
      innerSomeActionHasBeenCalled,
      false,
      'Component doesn\'t trigger inner \'someAction\' method');
  
    let outerSomeActionHasBeenCalled = false;
    component.attrs.someAction = function() {
      outerSomeActionHasBeenCalled = true;
    };
  
    component.sendDynamicAction('someAction');
    assert.strictEqual(
      outerSomeActionHasBeenCalled && !innerSomeActionHasBeenCalled,
      true,
      'Component trigger\'s outer \'someAction\' handler');
  });
});
