# Ember Flexberry Changelog
### New Features & improvements


## 2016-04-01
### Changes
Flexberry-groupedit
* showDeleteButtonInRow change default value on false

Mobile Flexberry-objectlistview
* showDeleteMenuItemInRow change default value on false
###
##

## 2016-03-29
### Breaking changes
FlexberryEnum
* Add new enum support functions and classes: initializer, transform and helper
* Remove old enum transform classes (enum-base, enum-string, enum-number)


## 2016-03-25
### Added
FlexberryObjectlistviewComponent:
* Add support castom route for edit model (property: editFormRoute)

### Breaking changes
FlexberryGroupeditComponent
* Add support castom route for edit model (property: editFormRoute).
  If your FlexberryGroupeditComponent use 'editOnSeparateRoute', you should define 'editFormRoute'

##

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
* Implement [beforeDeleteRecord](http://flexberry.github.io/Documentation/develop/classes/ObjectListView.html#method_beforeDeleteRecord) hook with cancel flag in ObjectListView ([74a22e5](https://github.com/Flexberry/ember-flexberry/commit/74a22e5b1c40784f8855d35d9a61170f2b37d91d));
* Implement [hook](http://flexberry.github.io/Documentation/develop/classes/ObjectListView.html#method_configurateRow) in ObjectListView for configuring rows ([6f9d480](https://github.com/Flexberry/ember-flexberry/commit/6f9d480723c474d8eda929148818e3229f831c8e));
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

FlexberryFileComponent
* Add mobile version.
* Add selected image preview (need flag 'showPreview' and property 'viewImageAction="flexberryFileViewImageAction"').

### Bug fixes
Moment:
* Add 'defaultFormat' initialization (now ENV.moment.defaultFormat will take an effect to both JS & HTMLBars-helpers);

### Breaking changes
