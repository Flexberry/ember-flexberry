# Ember Flexberry Changelog
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased]
### Added
* `devicejs`:
    * Add public function changeUserAgent for test.

### Changed
* Now `devicejs` import from vendor.

### Removed
* `devicejs` from bower.json.

## [0.9.0-beta.17] - 2017-09-07
### Added
* Mixins
    * Add `edit-form-controller-operations-indication` and `edit-form-route-operations-indication` mixins for edit forms controllers and routes.
* List components:
    * Add `minAutoColumnWidth` property (minimum column width, if width isn't defined in `userSettings`).
    * Add `columnsWidthAutoresize` property (indicates whether or not autoresize columns for fit the container width).
* Added components:
    * `flexberry-button`.
    * `flexberry-colorpicker`.
    * `flexberry-ddau-checkbox`.
    * `flexberry-ddau-slider`.
    * `flexberry-dialog`.
    * `flexberry-icon`.
    * `flexberry-jsonarea`.
    * `flexberry-tab-bar`.
    * `flexberry-tree`.
    * `flexberry-treenode`.
* Added icons for next buttons:
    * `refresh-button`.
    * `delete-button`.
    * `prev-page-button`.
    * `next-page-button`.

### Fixed
* When typing in the input field to search the `flexberry-simpleolv` component, `didRender` method that is problematic for the component is called.
* Fix `flexberry-groupedit` sorting.
* Fix form's loading spinner.

### Changed
* Deleted unnecessary Semantic-UI themes.
* `blues-sky` theme refactoring:
    * Updated names of several classes:
        * `text-menu-1` to `text-menu-show`.
        * `text-menu-2` to `text-menu-hide`.
        * `hidden-menu` to `hidden`.
    * Deleted useless classes: `my-test-user-button`, `theme-button`.
* Flexberry componets styles were moved to semantic default theme folder.
* Form's loading state now stored in `objectlistview-events` service.

## [0.9.0-beta.16] - 2017-08-11
### Added
* Manage animation of `flexberry-toggler` component through `duration` property.
* `flexberry-simpledatetime` component:
    * Added date and time validation when focus is changing.

### Fixed
* `blue-sky` theme:
    * Fix pager dropdown overflow in modal window.

### Changed
* Own loader from `object-list-view` and `flexberry-simpleolv` components replaced by loader on route template level.
* Page content width changing when sidebar is toggling.
* When sidebar is visible, it isn't blocking page content.

## [0.9.0-beta.15] - 2017-07-24
### Added
* Now list components use `DatePredicate` for filtering dates.
* Add user input for `flexberry-simpledatetime`.
* Add filters applying spinner.

### Changed
* Update dependency on `ember-flexberry-data` to version 0.9.0-beta.6.

### Known issues
* Now there is no way for filtering by timeless date in backend requests, therefore timeless date fields on backend must have 11:00:00.000 time in UTC.

## [0.9.0-beta.14] - 2017-07-18
### Added
* Add titles for component's buttons.

### Fixed
* Fix transition to `editForm` in FireFox.
* Fix filter columns shifts to left, when filter result is empty.
* Fix default buttons styles for `blue-sky` theme.
* Fix vertical scroll in list's components.
* Fix list's components width computing.

### Changed
* Change icons for remove filter and remove search buttons.
* Now locks gets userName from `UserSettingsService`.

## [0.9.0-beta.13] - 2017-07-05
### Fixed
* Fix delete button disabling after deletion on lists.
* Fix dropdown's overflow on list components.
* Fix groupEdit's adding new row on separate route.
* Fix `blue-sky` theme styles.

## [0.9.0-beta.12] - 2017-06-21
### Added
* Blueprints:
    * Add generation of `orange` theme for applications.

### Changed
    * `blueSky` theme renamed to `blue-sky`.
    * Now apps are importing themes from addon, themes are not generating to apps.

### Fixed
* Fix menu sidebar script to not apply on other sidebars.
* Fix `blue-sky` theme for displaying in IE.

## [0.9.0-beta.11] - 2017-06-14
### Added
* Blueprints:
    * Add some files to generation for `offline` support.
    * Add generation of `blueSky` theme for applications. This theme will be used as default theme for generated applications.

### Fixed
* Blueprints:
    * Fix master fields caption generation on `edit-forms`.
    * Fix `offline-serializers` generation.
* Localization:
    * Now default locale set in `environment.js` is not ignored.
    * If application is not support current browser languale (when default locale is not set) then `en` locale will be used for application.

### Changed
* Blueprints:
    * Now `custom-inflector-rules` generates capitalized plural words.

## [0.9.0-beta.10] - 2017-05-29
### Changed
* Update dependency on `ember-flexberry-data` to version 0.9.0-beta.5
* Blueprints:
    * Changed regular expression in `flexberry-core` for cyrillic support.

## [0.9.0-beta.9] - 2017-05-19
### Added
* Blueprints:
    * Add generation offline serializers.
    * Add generation mobile templates.
* Ability to set width for fixed columns in list components.

### Fixed
* Fix export excel file download for Internet Explorer.

## [0.9.0-beta.8] - 2017-05-05
### Added
* Add `readonly-cell` helper. It can specify `readonly` property for each cell of list components.
* Blueprints:
    * Add support reexport for addon.
    * Add generation non-stored properties of models.

### Changed
* Blueprints:
    * Now serializers are generating correctly in case of inheriting of models.

### Fixed
* `colsconfig-dialog-content` component:
    * Fix semantic styles for sort direction dropdown.

## [0.9.0-beta.7] - 2017-04-14
### Added
* Blueprints:
    * Add support ember objects and transforms generation (from classes with "type" stereotype in Flexberry Designer's class diagrams).

### Changed
* Update dependency on `ember-flexberry-data` to version 0.9.0-beta.4

### Fixed
* Blueprints:
    * Fix wrong path of tempates generation when process was started with `--dummy` option.
    * Fix generation to addon errors.
* Fix spinner for searching in list components.

## [0.9.0-beta.6] - 2017-04-12
### Added
* Add spinner for searching in list components.

### Changed
* Update dependency on `ember-flexberry-data` to version 0.9.0-beta.3.

## [0.9.0-beta.5] - 2017-04-11
### Added
* Add spinner for export to Excel form.
* Add localization for column names in exported excel file.

### Changed
* Now `exportExcelProjection` by default equals list's `modelProjection`.

### Fixed
* Fix wrong limit function applying in some cases for exporting data to Excel.

## [0.9.0-beta.4] - 2017-04-07
### Added
* Add getting current `limitFunction` from data object's list when exporting data to Excel.

### Changed
* Update dependency on `ember-flexberry-data` to version 0.9.0-beta.2.

### Fixed
* Fix autorization problems when exporting data to Excel.
* `user-settings` service:
    * Fix `userSettings` updating.
* `flexberry-simpleolv` component:
    * Fix columns width applying from `userSettings`.
* `olv-toolbar` component:
    * Fix `userSettings` names getting on first render.

## [0.9.0-beta.3] - 2017-03-29
### Added
* Add spinner for list components when redirecting to `editFormRoute`.

### Fixed
* Fix `modelName` getting in `olv-toolbar` controller when exporting data to Excel.

## [0.9.0-beta.2] - 2017-03-21
### Fixed
* `reload-list` mixin:
    * Сontroller is unaccessible in some cases inside `reloadList` method. So we added corresponding checks.

## [0.9.0-beta.1] - 2017-03-18
### Added
* `olv-toolbar` component:
    * Add default value for `modelController`. It's needed when using `olv-toolbar` component separately (apart from list components).
* Add export excel feature for list components.
* Add `fixed` setting for columns in `developerUserSettings` for list components.

### Changed
* Update dependency on `ember-flexberry-data` to version 0.9.0-beta.1.
* Update `jquery.colResizable` plugin to version 1.6.

### Fixed
* `flexberry-simpledatetime` component:
    * Fix wrong timezone storing when using component to choose date without time.

## [0.9.0-beta.0] - 2017-02-22
### Added
* `flexberry-toogler` component:
    * Add `hasResizableOLV` flag indicates when component need to initialize `colResizable` plugin.
* Add localization for sort order in list components.

### Changed
* `ui-message` component: `onShow` & `onHide` actions now sent on every change in visible property.
* Update dependency on `ember-flexberry-data` to version 0.9.0-beta.0.

### Removed
* `ui-message` component: attribute `title`.

## [0.8.6] - 2017-02-09
### Changed
* Update dependency on `ember-flexberry-data` to version 0.8.4.

## [0.8.5] - 2017-02-09
### Changed
* Update dependency on `ember-flexberry-data` to version 0.8.3.

### Fixed
* `flexberry-lookup` component:
    * Fix `placeholder` in dropdown mode.

## [0.8.4] - 2017-02-07
### Changed
* Update dependency on `ember-flexberry-data` to version 0.8.2.

### Fixed
* `flexberry-groupedit` component:
    * Fix check `hasMany` relationships changes on route leave.

## [0.8.3] - 2017-01-31
### Fixed
* `flexberry-simpledatetime` component:
    * Fix infinite click in mobile mode.

## [0.8.2] - 2017-01-26
### Changed
* Update dependency on `ember-flexberry-data` to version 0.8.1.

### Fixed
* `flexberry-dropdown` component:
    * Fix hanging in IE when change `perPageValue`.
* `flexberry-objectlistview` component:
    * Fix selected rows count reset on `init`.
* `flexberry-simpleolv` component:
    * Fix `colResizable` plugin init when `model` was overrided.

## [0.8.1] - 2017-01-18
### Added
* `flexberry-objectlistview` component:
    * Add hierarchy support on `edit-form`.
    * Add `defaultLeftPadding` property as padding value in each level of hierarchy (in pixels).

### Changed
* `flexberry-objectlistview` component:
    * Change hierarchy indent setting (`hierarchicalIndent` property) to `Number` type (in pixels).
* Update `flatpickr-calendar` dependency to 2.3.4.

###Fixed
* `flexberry-simpledatetime` component:
    * Fix `readonly` mode.
* `flexberry-objectlistview` component:
    * Fix columns compute when `modelProjection` is `undefined`.

## [0.8.0] - 2016-12-31
### Added
* `flexberry-simpleolv` component which renders it's content faster then `flexberry-objectlistview`. Component is inherited from `flexberry-objectlistview` component and has same functionality.
* `Ember.run.after` extension method into `Ember.run` namespace. Adds ability to rone some logic some after specified condition will be fulfilled.
* `object-list-view` component:
    * `showValidationMessagesInRow` option. Option is `false` by default in `object-list-view` & `flexberry-objectlistview`, but is `true` by default in `flexberry-groupedit`. If `true` then validation message will be shown in each cell containing invalid value.
    * `active` CSS-class to rows when component was clicked.
    * Delayed call to async logic using `Ember.run.after` to allow browser to apply changed styles first.
    * Async loading & rendering support of records.
    * Locales support for headers of `object-list-view` component.
* `flexberry-objectlistview` component:
    * Loader appearing after clicking on the head of column to sort records.
    * `filterByAnyWord` & `filterByAllWords` options. They can be used to configurate `filterByAnyMatch` logic.
    * `configurateSelectedRows` method to configure selected records.
    * Ability to display records total count.
* `flexberry-lookup` component:
    * Locks preventing from multiple subsequent clicks leading to data-requests.
    * `active` CSS-class when component was clicked or taped.
    * Delayed call to async logic using `Ember.run.after` to allow browser to apply changed styles first.
    * Support for `relatedModel` change in runtime.
    * `lookup-events` service containing `lookupDialogOnShowTrigger`, `lookupDialogOnVisibleTrigger`, `lookupDialogOnHiddenTrigger` methods to comunicate with `flexberry-lookup` components. **NOTE**:  `componenName` property must be defined for `flexberry-lookup` (usually in template).
    * Locks preventing from multiple data-requests when user press choose button several times in succession.
    * Semantic-ui settings for dropdown mode.
    * Ability to set default ordering using `orderBy` property (support same values format as in URL).
* `flexberry-menu` component:
    * `localeKey` property to each item.
* `flexberry-dropdown` component:
    * Semantic-ui settings.
`flexberry-groupedit` component:
    * Now `flexberry-groupedit` supports sorting.
    * Support of `developerUserSettings` for `flexberry-groupedit` component placed on `edit-form`.
    * `configurateSelectedRows` method to configure selected records.
* `object-list-view-cell` component:
    * `yield` content support.
`list-form` route:
    * Model loading hook-methods: `onModelLoadingStarted`, `onModelLoadingFulfilled`, `onModelLoadingRejected`, `onModelLoadingAlways`.
* User settings service:
    * Saving of records per page count in user setings for `flexberry-objectlistview`.
* Blueprints:
  * `sourceType` property generation into `flexberry-enum` transforms.
  * `ember-cli-sass` addon instalation into default blueprint.
* `form-load-time-tracker` service to track formsload & render time and `form-load-time-tracker` component to view data from `form-load-time-tracker` service.
* `perf` service to make performance bottlenecks visible in console timeline.
* `get-formatted` helper to get formatted values of simple types (`boolean` and `date` for now).

### Changed
* Update dependency on `ember-flexberry-data` to version 0.8.0.
* `flexberry-groupedit` component:
    * Restore ability to add menu items in row using `menuInRowAdditionalItems` property. Now this behavior is similar to `customButtons` property for toolbar.
    * Reduce width of filter button.
* `flexberry-objectlistview` component:
    * Restore ability to add menu items in row using `menuInRowAdditionalItems` property. Now this behavior is similar to `customButtons` property for toolbar.
    * Reduce width of filter button.
* `object-list-view` component:
    * Rename `headerClickable` property into `orderable`.
    * Now header's hint visible only when `orderable` = `true`.
* `edit-form` controller:
    * Add `rollBackModel` parameter to `close` method (as it's optional second parameter). Setting this parameter to `true` allows to rollback model after leaving route (applicable for detail's edit forms).
    * Add `skipTransition` parameter to `delete` method (as it's optionsl first parameter). Setting this parameter to `true` allows to skip technological call of `transitionToRoute` method.
    * Add `skipTransition` parameter to `saveAndClose`, `close` and `delete` actions (as their optionsl first parameter). Setting this parameter true allows to skip technological call of `transitionToRoute` method.
    * Add `skipTransition` parameter to `save` method (as it's second optional parameter) and `close` method (as its first optional parameter). Setting this parameter to `true` allows to skip technological call of `transitionToRoute` method.
* `detail-edit-form` controller:
    * Add `rollBackModel` parameter to `close` method (as it's optional second parameter). Setting this parameter to `true` allows to rollback model after leaving route (applicable for detail's edit forms).
    * Add `skipTransition` parameter to `saveAndClose`, `close` and `delete` actions (as their optionsl first parameter). Setting this parameter true allows to skip technological call of `transitionToRoute` method.
* `log` service:
    * Overriden methods of `Ember.Logger` now trigger corresponding events (`error`, `warn` etc.) instead of returning promises.
* Resolver:
    * Now, by default, only `component`, `template` and `view` types will be resolved accordingly to current device. If necessary, list of device-related types can be specified in `deviceRelatedTypes` property of application resolver. Also by default, device-related types will be searched only in 'mobile' subfolders, this behavior can be changed through `prefixForPlatformAndType`, `prefixForOrientation`, `prefixForType` properties of `device` service. This is for performance reasons.
* User settings service:
    * Replace alerts in `colsconfig-dialog` with `ui-messages`.
    * Now `colsconfig-dialog` has default cols width values.
    * Changed cursor style for `colsconfig-dialog-content`.
    * `col-config-menu` service:
        * Move `resetMenu`, `addNamedSetting` and `sort` methods into `olv-toolbar` and `flexberry-objectlistview`.
        * `sort` method is renamed into `sortNamedSetting`.
* `Ember.Logger.xxx` changed to `Ember.xxx` calls and throwing errors. So redundant messages will not display in console in production.

###Fixed
* `object-list-view` component:
    * `rowConfig` usage  in mobile mode.
    * Displaying of deletion errors if record deletion was unsuccessful.
    * Fix behavior with `filter` parameter added to route's url when `flexberry-lookup`'s list dialog is also opened.
    * Displaying of `flexberry-lookup` value when desktop version of `object-list-view` component is used in mobile mode.
    * Displaying of sorting indicator in `object-list-view` component.
    * Cells borders, now text doesn't fall outside of them.
    * Menu in row errors.
* `object-list-view-row` component:
    * Deprecation warnings which appears after content update.
* `flexberry-objectlistview` component:
    * Fix behavior when it is placed on `edit-form`.
    * Infinite loading after same per page value is selected.
    * Displaying of deletion errors if record deletion was unsuccessful.
    * Search by `number`, `decimal` and `boolean` values.
    * Rollback logic for unsuccessful delete operations.
    * Inability to resize columns if `tableStriped`, `rowClickable` or `customTableClass` property was changed.
* `flexberry-groupedit` component:
    * Inability to resize columns if `tableStriped`, `rowClickable` or `customTableClass` property was changed.
* `flexberry-lookup` component:
    * Readonly-mode when autocomplete is enabled.
    * Multiple words search mode in `flexberry-lookup` modal dialogs.
    * Double clicks sensivity.
    * Loader behavior in mobile mode.
    * Displaying of `flexberry-lookup` choosed value when lookup is embeded into new detail's row of `flexberry-groupedit` component.
`flexberry-file` component:
    * File download when `uploadUrl` property was changed.
`flexberry-menu` component:
    * Component was not responded to changing properties for root items.
* Base `flexberry` components:
    * `flexberry-textbox` and `flexberry-field` readonly mode.
* `flexberry-validationsummary` component:
    * Fix (with temporally solution) ember problem that causes an error. Problem also was fixed in [this PR](https://github.com/emberjs/ember.js/pull/13333) so temporally solution must be removed after update to ember 2.5.1 or higher.
* `flexberry-datepicker` component:
    * Shift date one day ahead when saving model after choosing date.
* `flexberry-simpledatetime` component:
    * Fix problems with absence of placeholder.
    * Fix behavior in IE and FF.
    * Fix two way binding problems in IE and FF.
    * Fix readonly mode in IE and FF.
* User settings service:
    * Sorting in `colsconfig-dialog` if form url has `sort` parameter.
    * `cols-config-menu` sensivity to multiple locale changes.
    * Named settings displaying in `cols-config-menu`.
    * Fix behavior of user settings dialog when `enableFilters` property of list components is enabled.
* List form's logic:
    * `filterCondition` query param when refreshing page.
    * `list-form` pagination in offline mode when offline storage doesn't contain any data.
    * Wrong getting of page number for lists of records if records count is zero.
* Edit form's logic:
    * `id` param receiveing on transition to parent route after saving and/or changing deatil modes of 2nd level.
    * Transition to detail model's edit form route form agregator's edit form route when agregator's model is not valid and `saveBeforeRouteLeave` option is `true`.
    * `detail-interaction` service behavior when closing detail model's edit form.
    * Detail model's saving logic in offline mode.
    * Detail model's delete logic in offline mode.
    * Rollback logic for unsuccessful delete operations.
    * Transition to parent route logic in `detail-edit-form` controller.
    * Aggregator model's reloading if detail model was modified.
    * Transition to edit form route when editing record has an `id` and `new` postfix at the same time.
    * Opening of `detail-edit-form` in `readonly` mode from `edit-form` in `readonly` mode, if `editOnSeparateRoute` setting is enabled in `flexberry-groupedit` component.
    * Redundant saving of agregator when transitioning to detail edit form.
* `log` service:
    * Fix `log` service settings initialization from application config.
    * Now throwing errors and promise errors are handling separately.
* User settings service:
  * Various `developerUserSettings` errors.
  * Reduntant confirm dialog in `colsconfig-dialog`.
* Fix `i-i-s-caseberry-logging-objects-application-log-l` and `new-platform-flexberry-services-lock-list` templates for use `recordsTotalCount` parameter.

### Removed
* `object-list-view` component:
    * `_attributeChanged` observer.
* `flexberry-objectlistview` and `olv-toolbar` components:
    * `createSettitingTitle`, `useSettitingTitle`, `editSettitingTitle`, `removeSettitingTitle`, `setDefaultSettitingTitle`, `showDefaultSettitingTitle` properties.
* `object-list-view-header-cell` component.
* `new-platform-flexberry-services-lock-edit` form.

### Known issues
* Changes in per page records count in `flexberry-objectlistview` component leads to it's hanging in IE.
* Incomprehensible one-way binding of `flexberry-lookup` `value` property in a new detail inside `flexberry-groupedit`.
* Changes in `showCheckBoxInRow` or `showDeleteButtonInRow` properties after adding new record in `flexberry-groupedit` leads to IE crashing.
* Current `page` URL parameter is not reset when deleting all records in list.
* Only one `flexberry-objectlistview` or `flexberry-groupedit` component could be used on particular form.
* List of values of `flexberry-dropdown` component are not showing over scroll bar when the component is embedded into `flexberry-groupedit` and there is not enough space to show these values over table rows.
* `flexberry-datepicker` eats too much memory, working slowly and slows down the application (especially when using multiple `flexberry-datepicker` components on form).
* Blueprints are not generating inheritance of serializers correctly. Also blueprints are not generating stuff for supporting offline mode in application.

## [0.6.1] - 2016-09-16
### Removed
* Remove `localforage` and `ember-localforage-adapter` from package dependencies and default blueprint. Now used only  `dexie` for IndexedDB access.

### Changed
* Updated dependency on `ember-flexberry-data` addon to v0.6.1. There fixed offline store adapter errors.

## [0.6.0] - 2016-09-14
### Added
* `flexberry-lookup` component:
    * Sorting direction for `autocomplete` and `dropdown` mode, use `sorting` property for specify direction.
    * Possibility reset value for `dropdown` mode, if `required` property not equals `true`.
    * Add property `dropdownIsSearch`. Now can be turned off autocomplete in dropdown mode.
* `flexberry-field` component:
    * Now support explicit html type definition. Default type is `text`.
* `flexberry-textbox` component:
    * Now support explicit html type definition. Default type is `text`.
* `flexberry-groupedit` component:
    * Add support of `configurateRow` method.
* `object-list-view` component:
    * Add observer `attributeChanged` that calls the `configurateRow` method. Now needs to use Ember.set(), to add custom class or show/hide buttons in menu items for record config.
* Support locks for `edit-form` route. Locks are not used by default, use [application config](https://github.com/Flexberry/ember-flexberry/blob/1fa9130c55a0dc07b0939f6499d97d98af0002e3/tests/dummy/config/environment.js#L41) to configure it.

### Changed
* Renamed `olv-toolbar-mixin` mixin to `olv-toolbar-controller`.
* Renamed `flexberry-lookup` mixin to `flexberry-lookup-controller`.
* Blueprint will no longer generate old top validator for properties in hbs templates.

### Fixed
* `flexberry-lookup` component not specify properties for select on `autocomplete` and `dropdown` mode.
* Now resolver is working correctly in IE.
* `flexberry-objectlistview` component:
    * Now for filter by any matches using all attributes of "master" model instead of one attribute with `displayMemberPath` option in projection.
    * If projection used for filter by any matches contains `hasMany` relationship, then that relationship will be skipped.
* Blueprints:
    * Generate correct `getCellComponent` function, if model has many "detail" models which refers to same "master" model.
    * Fix generation of validation rules inheritance in models.
    * Blueprint for hbs now generate clearly formatted code.
* Fixed wrong generation of columns list for user setting's dialog.
* Building filters in `object-list-view` component.
* Now `inflection` package installing along with `ember-flexberry` addon.
* Now `Save` and `Save and close` buttons on `detail-edit-form` after transition from new route working correctly.

### Removed
* Remove `base.js` from `models`. Now used the base model from `ember-flexberry-data` addon.

## [0.5.0] - 2016-09-05
### Added
* Blueprints:
    * Add support generation into ember addon.
* Resolver:
    * It is possible now to specify resources that should be resolved with origin resolving path (without considering device type detection).
* `flexberry-textarea` component:
    * Added support of HTML attributes.

### Changed
* Updated dependency on `ember-flexberry-data` addon to v0.5.0.
* Now performing transition to `edit-form` route after saving new model.
* `flexberry-file` component:
    * Renamed property for input element: `class` property was renamed to `inputClass`.

### Fixed
* `flexberry-checkbox` component:
    * Now if `flexberry-checkbox` was unchecked it doest'n has checked class.
* `flexberry-dropdown` component:
    * Fixed displaying of enums with empty values.
* `log` service will write error messages to console along with sending it to server if error would be handled in `Ember.onerror` or `Ember.RSVP.on('error')` events.
* Blueprints:
    * Fixed decimal fields generation on edit-forms (it will generate `flexberry-field` instead of `flexberry-dropdown`).
* `flexberry-checkbox` component:
    * `flexberry-checkbox` doesn't have `checked` class in unchecked state.
* `edit-form` controller: add сomponentProperties for `flexberry-file`.
* Now `flexberry-file`'s download button is disabled after deleting selected file and saving model.
* Filters for `flexberry-objectlistview` are working now (there was a code that was accidentally deleted during merges).
* `flexberry-toggler` component:
    * Now `expanded` property is not private & work.
    * Added `iconClass` property.
* Incorrect setting of first columns's width in `object-list-view` component.
* Wrong assertion for user setting's `width` property when creating a new detail in separate route.
* Rolling back `isDeleted` state of model if errors occurrs during destroying of the model.
* Now creating and editing of user settings are working properly on list forms.
* Fixed localization of column names displayed in column settings window.

### Removed
* Removed outdated style in `object-list-view` styles component.
* `flexberry-file` component:
    * Remove `fluid` CSS-class from component's defaults for `flexberry-file` component.

### Deprecated
* `edit-form` controller:
    * `rollbackHasManyRelationships` method was deprecated, use model's `rollbackHasMany` method instead.

### Known issues
* `flexberry-file` works improperly inside `flexberry-groupedit` when upload and delete file before saving model. Download button is active and it's possible to download deleted file after saving model and applying mentioned actions before saving.
* Only one `flexberry-objectlistview` or `flexberry-groupedit` component could be used on particular form.
* No items of context menu for rows of `flexberry-objectlistview` component are shown when `showEditMenuItemInRow` or `showDeleteMenuItemInRow` property of component has been dynamically changed.
* List of values of `flexberry-dropdown` component are not showing over scroll bar when the component is embedded into `flexberry-groupedit` and there is not enough space to show these values over table rows.
* If there's not enough space in window for displaying submenu of `flexberry-menu` component on bottom then submenu shows on top only first time. Then it shows on bottom.
* Formatted message field of log object fills differently in IE11/Safari and Chrome/Firefox.
* `flexberry-datepicker` eats too much memory, working slowly and slows down the application (especially when using multiple `flexberry-datepicker` components on form).
* "TransitionAborted" error get thrown when adding query params (callback is called once for each query param if `refreshModel: true` is set).
* `flexberry-datapicker` displays the next day when date with time is '00:00:00'.

## [0.4.0] - 2016-08-15
### Added
* Blueprints:
    * Add localization support for generated ember entities.
    * Add generation of explicit inflection rules. Rules for inflector are declared in `custom-inflector-rules.js` file inside `models` folder.
* `flexberry-dropdown` component:
    * Add support object type for `items` property.
    * Add support empty values for generated enums.

### Changed
* Transforms:
    * Moved transforms to [`ember-flexberry-data`](https://github.com/Flexberry/ember-flexberry-data) addon.
* Enums:
    * Moved enum initializer to [`ember-flexberry-data`](https://github.com/Flexberry/ember-flexberry-data) addon.
    * Renamed `enum-captions` helper to `flexberry-enum`.
* Changed dependency on `ember-flexberry-data` addon to [`v0.4.0`](https://github.com/Flexberry/ember-flexberry-data/releases/tag/0.4.0).

### Fixed
* `flexberry-objectlistview` component:
    * Incorrect work of pagination for large lists.

### Known issues
* Same as in previous release except issues in blueprints.

## [0.3.0] - 2016-07-29
### Added
* Custom internationalized captions for boolean type in `object-list-view-cell` component.
* Blueprints:
    * Add regeneration for models and serializers. Now models and serizlizers generates into separate regeneratable mixins, model and serializer classes will not be replaced during regeneration.
    * Add new `flexberry-group` blueprint for generation of group of entities by one blueprint.
    * Add generate of default comments for `flexberry-list-form` blueprint.
* Support of `flexberry-lookup` component in dropdown mode for mobile devices.
* `flexberry-objectlistview` component:
    * Add filtering by attribute of number type.
    * Add filtering by "master" attributes.
    * Add [`predicateForAttribute` method](http://flexberry.github.io/Documentation/master/classes/ListFormRoute.html#method_predicateForAttribute) for filtering customization in application.
    * Add filtering for each column.
    * Add hierarchical mode:
      * Autodetect availability of hierarchical mode by default.
      * Use [`hierarchyByAttribute` property](http://flexberry.github.io/Documentation/master/classes/FlexberryObjectlistview.html#property_hierarchyByAttribute) for building hierarchy.
      * Use [`disableHierarchicalMode` property](http://flexberry.github.io/Documentation/master/classes/FlexberryObjectlistview.html#property_disableHierarchicalMode)to disable hierarchical mode.
* `object-list-view` component:
    * Add localization support for model captions in projections.
* `flexberry-menu` component:
    * Added [`collapseMenuOnItemClick` property](http://flexberry.github.io/Documentation/master/classes/FlexberryMenu.html#property_collapseMenuOnItemClick) and related logic.
* Add `getValueFromLocales` helper function.
* Refactoring of user setting service:
    * User setting service now supports in-memory saving the settings of all `object-list-view` components for all pages. This allows:
        * Maintain user setting service on mode `APP.useUserSettingsService: false` without saving them to backend;
        * Store and appy (in future) settings for multiple components on a page;
        * Store an unlimited number of settings (default and named) for each `object-list-view` component;
        * Store (define) all the information on defaut or named setting (columns order, sorting order, columns width and other) in single object (property, backend record);
        * Customize the column widths manually by mouse or by specifying digital values;
        * Enable or disable the settings column widths;
        * Avoid repated access to the backend's usersetting service when you return to the already loaded page.
    * Support three levels of setting:
        * Defined by developer;
        * Defined by users and stored in usersetting's backend;
        * Temporary settings defined by users specified in the URL-parameters (`sort`, etc...).
        * Support user setting service for developer. After adjusting component developer can display current default and named settings and save them in [`developerUserSettings` property](http://flexberry.github.io/Documentation/master/classes/UserSettingsService.html#property_developerUserSettings)(see also [this](http://flexberry.github.io/Documentation/master/classes/IISCaseberryLoggingObjectsApplicationLogLRoute.html#property_developerUserSettings)) of `app/routes/{{pageRouteName}}.js` as default settings.

### Changed
* **Important**: now [`ember-flexberry`](https://github.com/Flexberry/ember-flexberry) depends on [`ember-flexberry-data@0.3.1`](https://github.com/Flexberry/ember-flexberry-data/releases/tag/0.3.1) that has [api changes](https://github.com/Flexberry/ember-flexberry-data/blob/master/CHANGELOG.md#changed). So it is necessary to make corresponding changes in application source code after updating vesrion of [`ember-flexberry`](https://github.com/Flexberry/ember-flexberry)!
* `flexberry-file`:
    * Removed collapsing menu logic.
    * Added [`collapseMenuOnItemClick` property](http://flexberry.github.io/Documentation/master/classes/FlexberryMenu.html#property_collapseMenuOnItemClick) to appropriate .hbs file (template).
* Blueprints:
    * `editFormRoute` property was moved to controller.

### Fixed
* Blueprints:
    * Speed up generation process.
    * Fixed adapter generation in `flexberry-core` blueprint.
* Fixed selection of value for `flexberry-lookup` component in dropdown mode.
* Fixed displaying of column settings buttons if user settings service is off or menu items list for column settings is empty.
* Fixed sorting by clicking on table header of `flexberry-objectlistview` or `flexberry-groupedit` component in Firefox.
* Fixed blueprints dependency for generation of application prototype for hide the sidebar with sitemap after click on sitemap-node.
* Fixed `flexberry-menu` for configuration of columns settings in `flexberry-objectlistview` component after changing current locale for internationalization to another language and back again.
* Now [`displayAttributeName` property](http://flexberry.github.io/Documentation/master/classes/FlexberryLookup.html#property_displayAttributeName) is required for only autocomplete and dropdown modes in `flexberry-lookup` component.

### Known issues
* Only one `flexberry-objectlistview` or `flexberry-groupedit` component could be used on particular form.
* It is not possible to open any route for generated application prototype (in case of generation of whole application prototype) because of wrong generation of internationalization mechanism. Also probably lookup components on edit forms of generated application prototype may not work.
* It is not possible to sort list of models by property of "master" model if property of another "master" model from used projection has the same name.
* No items of context menu for rows of `flexberry-objectlistview` component are shown when `showEditMenuItemInRow` or `showDeleteMenuItemInRow` property of component has been dynamically changed.
* List of values of `flexberry-dropdown` component are not showing over scroll bar when the component is embedded into `flexberry-groupedit` and there is not enough space to show these values over table rows.
* Formatted message field of log object fills differently in IE11/Safari and Chrome/Firefox.
* `flexberry-datepicker` eats too much memory, working slowly and slows down the application (especially when using multiple `flexberry-datepicker` components on form).
* "TransitionAborted" error get thrown when adding query params (callback is called once for each query param if `refreshModel: true` is set).
* `flexberry-datapicker` displays the next day when date with time is '00:00:00'.
* Placeholder text localization for `flexberry-dropdown` component works improperly when `readonly` property changes dynamically. Also placeholder text is not localize in all browsers except Google Chrome.
* Some text is not localized in user settings dialog.
* There are some problems with displaying styles of user settings dialog.
* Drop-down menu for configuration of columns settings in `flexberry-objectlistview` component stops working properly after deleting of user setting or changing page on list form.

## [0.2.1] - 2016-07-07
### Changed
* Updated information about [release process in README.md](https://github.com/Flexberry/ember-flexberry/blob/master/README.md#releasing)

### Fixed
* Fixed wrong dependency from [`ember-flexberry-data`](https://github.com/Flexberry/ember-flexberry-data) addon.
* Fixed wrong import of `register-version.js`.

## [0.2.0] - 2016-07-06 [YANKED]
### Added
* New components based on `object-list-view` component to work with lists of models on list forms and edit forms (see more details below):
    * `flexberry-objectlistview` - usually used on list forms to work with list of "base" models loaded in route.
    * `flexberry-groupedit` - used on edit forms to work with list of models, referenced by "base" model using hasMany relationship ("detail" models).
* Support of setting conditions ("limits") on form's routes for loading data. Limits can be set with client query language ([LINQ-like](https://msdn.microsoft.com/en-us/library/bb397926.aspx) language) defined in [ember-flexberry-data](https://github.com/Flexberry/ember-flexberry-data) addon.
* Support of any backend types. It is necessary to implement adapter for client query language to support a particular backend type. The adapter should translate query object into request specific to corresponding backend. There are several adapters implemented in [ember-flexberry-data](https://github.com/Flexberry/ember-flexberry-data) addon:
    * Adapter for [OData-based](http://www.odata.org/) backends.
    * Adapter for querying arrays of JavaScript objects (like [LINQ to Objects](https://msdn.microsoft.com/en-us/library/bb397919.aspx)).
    * Adapter for [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) (using to support queries in offline mode).
* Components based on [Semantic UI](http://semantic-ui.com/) framework:
    * `flexberry-base-component` - base component for most of other flexberry components. It should not be used independently.
    * `flexberry-checkbox` - wrapper for base checkbox component.
    * `flexberry-datepicker` - renamed `datetime-picker` component for choose date and time. Added features:
        * Ability of specifying min and max date for displaying range.
    * `flexberry-dropdown` - renamed `drop-down` component for select value from list. Now it is based on [Semantic UI Dropdown](http://semantic-ui.com/modules/dropdown.html) component.
    * `flexberry-field` - component for displaying input with label.
    * `flexberry-file` - component for upload and download files to/from backend. Backend should include corresponding web service to ensure that the component works. Basic features:
        * Configurable upload URL and other parameters.
        * Choose file to upload.
        * Reset uploading file.
        * Download previously uploaded file.
        * Show preview for images (with showing full-size image in modal window when click on preview).
        * Store file metadata in specified model property.
        * Separate template for mobile devices.
    * `flexberry-groupedit` - component for displaying list of "detail" models within table and performing opertaions with these models such as create, edit and delete. It composed by `groupedit-toolbar` and `object-list-view` components. It should be used on edit forms to work with "detail" models. Basic features:
        * Add "detail" model directly in component.
        * Edit "detail" model directly in component.
        * Edit "detail" model on edit form that opens in separate route by click on particular table row. This feature allows to edit "detail" models of 2nd and further levels.
        * Optional saving of "detail" models before leaving route.
        * Select rows with "detail" models.
        * Delete selected or particular "detail" models.
        * Support of embedding another components in table cells to display and edit specific field of the "detail" model.
        * Sorting list of models my clicking on table headers.
        * Resizing columns of the table.
        * Separate template for mobile devices.
    * `flexberry-lookup` - renamed `lookup-field` component for select related model, referenced by "base" model using belongsTo relationship ("master" models). Added features:
        * Displaying list of "master" models with `flexberry-objectlistview` component instead of `object-list-view` component with ability to set custom properties for `flexberry-objectlistview` component.
        * Autocomplete mode.
        * Dropdown mode (without opening list of "master" models list in modal window).
        * Adding custom css classes for buttons.
        * Setting conditions ("limits") on displaying list of "master" models with client query language.
    * `flexberry-menu` - component for displaying multilevel menu. Basic features:
        * Configurable set of menu items.
        * Setting icons for menu items.
        * Setting handler for clicking on menu items.
    * `flexberry-objectlistview` - component for displaying list of "base" or "detail" models within table and performing opertaions with these models such as create, edit and delete. It composed by `olv-toolbar` and `object-list-view` components and also including markup for pagination. Usually it should be used on list forms to work with "base" models. Basic features:
        * Add  model on edit form that opens in separate route by click on corresponding button in toolbar.
        * Edit model on edit form that opens in separate route by click on particular table row.
        * Select rows with models.
        * Delete selected models.
        * Using pagination with ability of specifying record count per page.
        * Adding custom buttons in toolbar.
        * Resizing columns of the table.
        * Filtering list of models by searching specified string in all string properties of models.
        * Sorting list of models my clicking on table headers.
        * Configuring column settings including sorting, order of columns, visibility and ability to save configured settings with specified name on backend.
        * Setting conditions ("limits") on displaying list of models with client query language.
        * Showing customizable context menu for each row by clicking on corresponding button.
        * Ability to place component on edit form including to work with "detail" models.
        * Supporting promise for specifying displaying list of models.
        * Separate template for mobile devices.
    * `flexberry-simpledatetime` - component for for choose date and time based on HTML5 capabilities.
    * `flexberry-textarea` - wrapper for base textarea component.
    * `flexberry-textbox` - wrapper for base input component.
    * `flexberry-toggler` - component for collapsing and expanding inner content (components and markup). Basic features:
        * Collapsing and expanding inner content.
        * Setting title for component.
    * `flexberry-validationmessage` - component for displaying message of validation error on edit form for particular property of model. Basic features:
        * Specifying model property for displaying validation error.
        * Specifying pointing for component's appearance.
    * `flexberry-validationsummary` - component for displaying list of validation errors of model on edit form.
    * `groupedit-toolbar` - toolbar for `flexberry-groupedit` component. Support displaying of add and delete buttons. It should not be used independently.
* Improved resolver to support substitution of source files for different device types (e.g. handlebars templates, .js files etc.). Device type detection based on [devicejs](https://github.com/matthewhudson/device.js) library. There are several component templates for mobile platforms that available out of the box (i.e. these components should look different on mobile devices):
    * Template for `flexberry-file` component.
    * Template for `flexberry-lookup` component.
    * Template for `object-list-view` component (used inside `flexberry-objectlistview` and `flexberry-groupedit` components).
* Logging service for saving errors and warnings on backend. Can be used optionally.
* List and edit forms for displaying saved logs.
* User settings service for storing component's settings for current user on backend.
* Internationalization engine based on [ember-i18n](https://github.com/jamesarosen/ember-i18n).
* Validator for `date` type of model properties.
* Transform to support using `file` type in models.
* Blueprints for generation of application prototype or its parts. Generation is based on using application metadata that could be creadted manually or using [Flexberry Designer](http://flexberry.ru/Flexberry/ForDevelopers/FlexberryDesigner) from corresponding UML class diagramms. Available blueprints:
    * `flexberry-application` - bluepring for generation of whole application prototype.
    * `flexberry-core` - bluepring for generation of base structure of application prototype
    * `flexberry-edit-form` - bluepring for generation of controller, route and template for specified edit form.
    * `flexberry-enum` - bluepring for generation of transform and file with definition for specified enumeration.
    * `flexberry-list-form` - bluepring for generation of controller, route and template for specified list form.
    * `flexberry-model` - bluepring for generation of specified model and serializer with corresponding tests.

### Changed
* Upgraded `ember-cli` from @1.13.8 to @2.4.3. Ember 1.13 is no longer supported.
* `object-list-view` and `olv-toolbar` components are no longer used independently. It is necessary to use `flexberry-objectlistview` component or `flexberry-groupedit` component instead.
* Renamed `datetime-picker` component to `flexberry-datepicker`.
* Renamed `drop-down` component to `flexberry-dropdown`.
* Renamed `lookup-field` component to `flexberry-lookup`.
* Base adapter and serializer for communication with backend via [OData protocol](http://www.odata.org/) was moved to [ember-flexberry-data](https://github.com/Flexberry/ember-flexberry-data) addon (this addon was formerly named as `ember-flexberry-projections`). So now [`ember-flexberry`](https://github.com/Flexberry/ember-flexberry) depends on [`ember-flexberry-data@0.2.0`](https://github.com/Flexberry/ember-flexberry-data/releases/tag/0.2.0)
* Redesigned enumerations support.

### Deprecated
* `ui-message` component:
    * `title` property is deprecated, use `caption` property instead.

### Removed
* Authenticator, authorizer, login route and controller for support of token based authentication were removed. Authentication is not supported for now.

### Fixed
* Fixed saving model logic on edit forms so that corresponding OData-queries is now making following the [standard](http://www.odata.org/documentation/).
* Fixed setting of date in binded model property when typing date manually using `flexberry-datepicker` component.
* Fixed support of embedding components in table cell of `object-list-view` component to display and edit specific field of the model.

### Known issues
* Only one `flexberry-objectlistview` or `flexberry-groupedit` component could be used on particular form.
* Internationalization is not implemented for captions in model projections.
* It is not possible to open any route for generated application prototype (in case of generation of whole application prototype) because of wrong generation of internationalization mechanism.
* It is not possible to sort list of models by property of "master" model if property of another "master" model from used projection has the same name.
* Some items of context menu for rows of `flexberry-objectlistview` component are disappearnig when `showEditMenuItemInRow` or `showDeleteMenuItemInRow` property of component has been dynamically changed.
* Sorting by clicking on table header of `flexberry-objectlistview` or `flexberry-groupedit` component is not working in Firefox.
* List of values of `flexberry-dropdown` component are not showing over scroll bar when the component is embedded into `flexberry-groupedit` and there is not enough space to show these values over table rows.
* Logs for rejected promises are not saving on backend.
* Formatted message field of log object fills differently in IE11/Safari and Chrome/Firefox.
* `flexberry-datepicker` eats too much memory, working slowly and slows down the application (especially when using multiple `flexberry-datepicker` components on form).
* Drop-down menu for configuration of columns settings in `flexberry-objectlistview` component stops working after changing current locale for internationalization to another language and back again.
* Drop-down menu for configuration of columns settings in `flexberry-objectlistview` component stops working properly after saving user setting on backend.
* Saving user settings for `flexberry-groupedit` component and for `flexberry-objectlistview` that shows for choosing value for `flexberry-lookup` component doesn't work correctly. It is possible to use `notUseUserSettings` property for `flexberry-objectlistview` component to turn off user settings for these cases as workaround.

## [0.1.0] - 2015-12-05
### Added
* Base list form route and controller with support of pagination and sorting for data placed in `object-list-view` component.
* Base edit form route and controller with support of `save`, `delete` and `close` actions.
* Base adapter and serializer for communication with backend via [OData protocol](http://www.odata.org/).
* Components based on [Semantic UI](http://semantic-ui.com/) framework:
    * `datetime-picker` - component for choose date and time based on [semantic-ui-daterangepicker](https://github.com/milimetric/semantic-ui-daterangepicker) component.
    * `drop-down` - component for select value from list (based on `select` html element).
    * `lookup-field` - component for select related model, referenced by "base" model using belongsTo relationship ("master" models). Basic features:
        * Displaying list of related models in `object-list-view` component, that is shown in modal dialog window, by clicking on choose button.
        * Displaying of specified property of related model for choosed value.
        * Reset choosed value by clicking on remove button.
        * Support of changing text displayed on buttons.
    * `modal-dialog` - component for showing templates in modal dialog window, based on [Modal] (http://semantic-ui.com/modules/modal.html) Semantic UI module.
    * `object-list-view` - component for displaying list of records that are instances of the models. Component can be used on list forms and edit forms (one component per form for now). Basic features:
        * List of table headers is based on model projections that are defined in the models. Model projections support is implemented in [ember-flexberry-projections](https://github.com/Flexberry/ember-flexberry-data) addon.
        * Change sorting order by clicking on the table headers.
        * Transition to edit form for particular model by clicking on table row.
        * Support of embedding components in table cells to display specific field of the model.
        * Support of displaying list of models, referenced by "base" model using hasMany relationship ("detail" models), on edit form.
    * `olv-toolbar` - toolbar for `object-list-view` component. Support displaying of add and refresh buttons.
    * `ui-message` - component for displaying success and error messages (e.g. on edit form when fail to save model).
* Support of validation rules that can be defined in models (using [ember-validations](https://github.com/DockYard/ember-validations) addon).
* Transforms to support using `enum` type in models.
* Sitemap template for displaying application menu.
* Authenticator, authorizer, login route and controller for support of token based authentication (using [ember-simple-auth](https://github.com/simplabs/ember-simple-auth) library).
