/**
  @module ember-flexberry
*/

/**
  Injects a {{#crossLink "DeviceService"}}device service{{/crossLink}} into current application
  components, controllers, models, routes, views, inside application router, and into application resolver.

  @for ApplicationInstanceInitializer
  @method device.initialize
  @param {<a href="https://www.emberjs.com/api/ember/release/classes/ApplicationInstance">ApplicationInstance</a>} applicationInstance Ember application instance.
*/
export function initialize(applicationInstance) {
  // Inject device detection service into application parts.
  [
    'component',
    'controller',
    'model',
    'route',
    'router:main',
    'view',
  ].forEach(type => {
    applicationInstance.application.inject(type, 'device', 'service:device');
  });

  // Inject device detection service into application resolver.
  // 1. The fact is that ember creates an instance of resolver before any of the initializers will be called
  // (instantiated resolver is stored in application__registry__.resolver).
  // 2. We can't inject device detection service into resolver through call to
  // application.inject('resolver:main, 'device', 'service:device'), it will inject service into future resolver's instances,
  // but it will not inject service into already instantiated resolver.
  // 3. We also can't inject device detection service through call to inject('device')
  // inside resolver's class, because resolver is not instantiated via container, and ember will throw an error:
  // 'Attempting to lookup an injected property on an object without a container...'.
  // 4. So the the most appropriate way to inject device detection service into application resolver
  // is to reopen application resolver class, and manually add service instance as resolver's property,
  // it will have an effect on both already existing and future instances.
  var deviceService = applicationInstance.lookup('service:device');
  applicationInstance.application.Resolver.reopen({
    device: deviceService
  });

  // For some reason reopen will take an effect only after new instantiation.
  // Without this call to 'Rersolver.create' device detection service won't be injected into existing resolver instance
  // (stored in application__registry__.resolver).
  applicationInstance.application.Resolver.create();
}

export default {
  name: 'device',
  initialize
};
