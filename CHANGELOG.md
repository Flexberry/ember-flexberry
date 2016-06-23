# Ember Flexberry Changelog
### New Features & improvements

## 2016-06-22
### Added
FlexberryCheckboxComponent:
* Add class property for wrapper component.

## 2016-06-14
### Fixed
FlexberryTextboxComponent, FlexberryTextareaComponent:
* Remove disabled class for wrapper.

## 2016-06-03
### Fixed
FlexberryObjectlistviewComponent
* Fix adding limit on loaded data (now limit predicates are used and no query parameter displays current limit predicate).

## 2016-06-02
### Added
FlexberryLookupComponent:
* Add opportunity to customize FlexberryObjectlistviewComponent on modal window.
### Fixed
FlexberryLookupComponent:
* Fix autocomplete request path.
* Fix limit functions (predicates) for lookups.
FlexberryObjectlistviewComponent
* Fix filters (now it is applied only to string own attributes).

## 2016-06-01
### Breaking changes
* Fix locate structure & component.

## 2016-05-30
### Fixed
FlexberryLookupComponent:
* When enable autocomplete, impossible to clear lookup value.

## 2016-05-26
### Added
FlexberryGroupeditComponent:
* Add properties (createNewButton and deleteButton) to customize the toolbar.

## 2016-05-24
### Breaking changes
Addon change:
* Delete dependency on ember-simple-auth:
 * Delete authenticator token
 * Delete authorizer token
 * Delete controller login
 * Delete route login
 * Delete template login
 * Delete services:
  * flexberry-auth-service
  * flexberry-ember-simple-auth-service
* Delete dependency on ember-local-storage:
 * Delete model settings
 * Update mixin paginated-controller
### Fixed
FlexberryLookupComponent:
* When backend is slow, modal window not closed after select item.

## 2016-05-18
### Added
FlexberryObjectlistviewComponent, FlexberryGroupeditComponent:
* Add tableStriped, customTableClass, tableClass properties.

FlexberryObjectlistviewComponent:
* Add action removeFilter.

## 2016-05-17
### Breaking changes
FlexberryObjectlistviewComponent:
* Move actions from list-form to mixins FlexberryObjectlistviewRouteMixin.
* Rename action 'rowClick' to 'objectListViewRowClick'.
* Added 'confirmDeleteRow' and 'confirmDeleteRows' hooks.

FlexberryGroupeditComponent:
* Rename action 'rowClick' to 'groupEditRowClick'.
* Rename property 'rowClick' to 'action'.
* Added 'confirmDeleteRow' and 'confirmDeleteRows' hooks.

EditFormController:
* Added overloaded methods 'onSaveActionFulfilled', 'onSaveActionRejected', 'onDeleteActionFulfilled' and 'onDeleteActionRejected'.

## 2016-05-11
### Breaking changes
EditFormNewRoute:
* Parameter 'templateName' is required.

## 2016-05-10
### Breaking changes
FlexberryLookupComponent:
* Add mode dropdown.
* Add displayAttributeName. Name of the attribute of the model to diplay for the user.
* Now value is instance of the model.
* Rename autocompleteUpdateAction to updateLookupAction.
* Rename autocompleteMinCharacters to minCharacters.
* Rename autocompleteMaxResults to maxResults.
* Remove autocompleteUpdateXhrAction, updateAutocompleteLookupXhr, getLookupAutocompleteUrl, getAutocompleteLookupQueryOptions, limitFunction, autocompleteUrl, autocompleteQueryOptions, autocompleteProperty.

## 2016-05-06
### Breaking changes
FlexberryLookupComponent:
* Rename classChoose to chooseButtonClass.
* Rename classRemove to removeButtonClass.

FlexberryFileComponent, FlexberryObjectlistviewComponent, FlexberryGroupeditComponent:
* Rename classButton to buttonClass.

## 2016-05-05
### Breaking changes
FlexberryObjectlistviewComponent:
* Parameter 'editFormRoute' is required.
EditFormController:
* Parameter 'parentRoute' is required.

## 2016-04-15
### Fixed
Lookup with autocomplete:
* Add opportunity to set authentication headers to autocomplete request.

## 2016-04-11
### Added
FlexberryObjectlistviewComponent, FlexberryGroupeditComponent:
* Add opportunity to resize columns.
* Add stubbed opportunity to save settings to user settings service (now there is odata problem with 'eq').

## 2016-04-01
### Changes
Flexberry-groupedit
* showDeleteButtonInRow change default value on false

Mobile Flexberry-objectlistview
* showDeleteMenuItemInRow change default value on false

## 2016-03-29
### Breaking changes
FlexberryEnum
* Add new enum support functions and classes: initializer, transform and helper
* Remove old enum transform classes (enum-base, enum-string, enum-number)


## 2016-03-25
### Added
FlexberryObjectlistviewComponent:
* Add support custom route for edit model (property: editFormRoute)

### Breaking changes
FlexberryGroupeditComponent
* Add support custom route for edit model (property: editFormRoute).
  If your FlexberryGroupeditComponent use 'editOnSeparateRoute', you should define 'editFormRoute'

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
