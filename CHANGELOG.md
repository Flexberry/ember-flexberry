# Ember Flexberry Changelog
### New Features & improvements
i18n:
* Move initialization from application route into application initializer;

Moment:
* Move initialization from application route into application initializer;
* Inject moment service into routes, controllers, components, etc. as 'moment' property.
* Add locale synchronization with i18n locale;

Mobile devices support:
* Add device detection service;
* Add resolver capable to resolve templates & classes depending on current device type;

ODataSerializer:
* Move Mixin DS.EmbeddedRecordsMixin into ember-flexberry addon (relation 'odata-id' now is used for belongsTo relations);

FlexberryObjectlistviewComponent:
* Add support of delete button in row of flexberry-objectlistview;
* Add mobile version of the component;
* Add optional column with dropdown menu;
* Add single column mode;

FlexberryGroupeditComponent:
* Add opportunity to edit detail on separate route;
* Add mobile version of the component;
* Add optional column with dropdown menu;
* Add single column mode;

FlexberryMenuComponent
* Add 'flexberry-menu' component;

FlexberryCheckboxComponent
* Add 'onChange' action;

### Bug fixes
Moment:
* Add 'defaultFormat' initialization (now ENV.moment.defaultFormat will take an effect to both JS & HTMLBars-helpers);

### Breaking changes