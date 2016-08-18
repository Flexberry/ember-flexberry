# Ember Flexberry Changelog
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased]
### Changed

### Added
* Blueprints:
    * Add support generation into ember addon.
* It is possible now to specify resources that should be resolved with origin resolving path (without considering device type detection).
* `flexberry-textarea` component:
    * Added support of HTML attributes.

### Fixed
* `log` service will write error messages to console along with sending it to server if error would be handled in `Ember.onerror` or `Ember.RSVP.on('error')` events.


## [0.4.0] - 2016-08-15
### Changed
* Transforms:
    * Moved transforms to [`ember-flexberry-data`](https://github.com/Flexberry/ember-flexberry-data) addon.
* Enums:
    * Moved enum initializer to [`ember-flexberry-data`](https://github.com/Flexberry/ember-flexberry-data) addon.
    * Renamed `enum-captions` helper to `flexberry-enum`.

### Added
* Blueprints:
    * Add localization support for generated ember entities.
    * Add generation of explicit inflection rules. Rules for inflector are declared in `custom-inflector-rules.js` file inside `models` folder.
* `flexberry-dropdown` component:
    * Add support object type for `items` property.
    * Add support empty values for generated enums.

### Fixed
* `flexberry-objectlistview` component:
    * Incorrect work of pagination for large lists.

## [0.3.0] - 2016-07-29
### Added
* Custom internationalized captions for boolean type in `object-list-view-cell` commponent.
* Blueprints:
    * Add regeneration for models and serializers. Now models and serizlizers generates into separate regeneratable mixins, model and serializer classes will not be replaced during regeneration.
    * Add new `flexberry-group` blueprint for generation of group of entities by one blueprint.
    * Add generate of default comments for `flexberry-list-form` blueprint.
* Support of `flexberry-lookup` component in dropdown mode for mobile devices.
* `flexberry-objectlistview` component:
    * Add filtering by attribute of number type.
    * Add filtering by master attributes.
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
* It is possible to save user settings when user settings serive is off.
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
