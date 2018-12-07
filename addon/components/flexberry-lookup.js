/**
  @module ember-flexberry
*/

import Ember from 'ember';
import FlexberryBaseComponent from './flexberry-base-component';

import { translationMacro as t } from 'ember-i18n';
import { getRelationType } from 'ember-flexberry-data/utils/model-functions';
import { Query } from 'ember-flexberry-data';

const {
  Builder,
  Condition,
  BasePredicate,
  StringPredicate,
  ComplexPredicate
} = Query;

/**
  Lookup component for Semantic UI.

  @example
    ```javascript
    // app/controllers/post.js
    import EditFormController from './edit-form';
    export default EditFormController.extend({
      ...
    });
    ```

    ```handlebars
    <!-- app/templates/post.hbs -->
    ...
    {{flexberry-lookup
      componentName="AuthorLookup"
      choose="showLookupDialog"
      remove="removeLookupValue"
      value=model.author
      projection="UserL"
      relationName="author"
      displayAttributeName="name"
      title="Author"
      placeholder="Not select"
      chooseText="Select"
      removeText="Clear"
      perPage=50
    }}
    ...
    ```

  @class FlexberryLookup
  @extends FlexberryBaseComponent
*/
export default FlexberryBaseComponent.extend({
  /**
    This property is used in order to cache loaded for dropdown mode values.
    Values are kept as array with master id as key and master object as value.
    This property is initialized after request to server got dropdown values.
    This cache is important because semantic ui dropdown component lets use only text values,
    while for lookup it is necessary to get object values.

    @property _cachedDropdownValues
    @private
    @type Array
  */
  _cachedDropdownValues: undefined,

  /**
    This property is used in order to cache last value
    of flag {{#crossLink "FlexberryLookup/autocomplete:property"}}{{/crossLink}}
    in order to let init this mode afrer re-render only once if flag was enabled.

    @property _cachedAutocompleteValue
    @private
    @type Boolean
  */
  _cachedAutocompleteValue: undefined,

  /**
    This property is used in order to cache last value
    of flag {{#crossLink "FlexberryLookup/dropdown:property"}}{{/crossLink}}
    in order to let init this mode afrer re-render only once if flag was enabled.

    @property _cachedDropdownValue
    @private
    @type Boolean
  */
  _cachedDropdownValue: undefined,

  /**
    Text to be displayed in field, if value not selected.

    @property placeholder
    @type String
    @default t('components.flexberry-lookup.placeholder')
  */
  placeholder: t('components.flexberry-lookup.placeholder'),

  /**
    Text on button preview value.

    @property previewText
    @type String
    @default '<i class="eye icon"></i>'
  */
  previewText: '<i class="eye icon"></i>',

  /**
    Text on button opening a modal window.

    @property chooseText
    @type String
    @default '<i class="change icon"></i>'
  */
  chooseText: '<i class="change icon"></i>',

  /**
    Text on button clear value.

    TODD: Use 'flexberry-lookup.remove-button-text' from locale.

    @property removeText
    @type String
    @default '<i class="remove icon"></i>'
  */
  removeText: '<i class="remove icon"></i>',

  /**
    CSS classes for preview button.

    @property previewButtonClass
    @type String
  */
  previewButtonClass: undefined,

  /**
    CSS classes for choose button.

    @property chooseButtonClass
    @type String
  */
  chooseButtonClass: undefined,

  /**
    CSS classes for remove button.

    @property removeButtonClass
    @type String
  */
  removeButtonClass: undefined,

  /**
    Projection name.

    @property projection
    @type String
    @required
  */
  projection: undefined,

  /**
    Relation name.

    @property relationName
    @type String
    @required
  */
  relationName: undefined,

  /**
    Title for modal window.

    @property title
    @type String
  */
  title: undefined,

  /**
    Flag to show that lookup is in autocomplete mode.

    @property autocomplete
    @type Boolean
    @default false
  */
  autocomplete: false,

  /**
    Flag to show that lookup is in dropdown mode.

    @property dropdown
    @type Boolean
    @default false
  */
  dropdown: false,

  /**
    Flag to show in lookup preview button.

    @property showPreviewButton
    @type Boolean
    @default false
  */
  showPreviewButton: false,

  /**
    The URL that will be used for viewing the selected object.

    @property previewFormRoute
    @type String
    @default undefined
  */
  previewFormRoute: undefined,

  /**
    Projection name preview form.

    @property previewFormProjection
    @type String
    @default undefined
  */
  previewFormProjection: undefined,

  /**
    Flag to show the selected object in separate route.

    @property previewOnSeparateRoute
    @type Boolean
    @default false
  */
  previewOnSeparateRoute: false,

  /**
    The controller for viewing the selected object.

    @property controllerForPreview
    @type String
    @default undefined
  */
  controllerForPreview: undefined,

  /**
    Flag to show that lookup has search or autocomplete in dropdown mode.

    @property dropdownIsSearch
    @type Boolean
    @default false
  */
  dropdownIsSearch: false,

  /**
    Specify direction for sorting by `displayAttributeName`.
    For `autocomplete` or `dropdown` mode only.
    Possible values: `asc` or `desc`.

    @property sorting
    @type String
    @default 'asc'
  */
  sorting: 'asc',

  /**
    Classes by property of autocomplete.

    @property autocompleteClass
    @type String
    @readOnly
  */
  autocompleteClass: Ember.computed('autocomplete', function() {
    if (this.get('autocomplete')) {
      return 'ui search';
    }
  }),

  /**
    FOLV component name.

    @property folvComponentName
    @type String
    @readOnly
  */
  folvComponentName: Ember.computed('componentName', function() {
    let componentName = this.get('componentName') || 'undefined';
    return `${componentName}`;
  }),

  /**
    Action's name to update model's relation value.

    @property updateLookupAction
    @type String
    @default 'updateLookupValue'
  */
  updateLookupAction: 'updateLookupValue',

  /**
    Maximum number of results to display on autocomplete or dropdown.

    @property maxResults
    @type Number
    @default 10
  */
  maxResults: 10,

  /**
    Limit function on lookup.
    It should not be just a string, it has to be predicate function (otherwise an exception will be thrown).

    @property lookupLimitPredicate
    @type BasePredicate
    @default undefined
  */
  lookupLimitPredicate: undefined,

  /**
    This computed property forms a set of properties to send to lookup window.
    Closure action `lookupWindowCustomProperties` is called here if defined,
    otherwise `undefined` is returned.

    @example
      ```javascript
      // app/controllers/post.js
      import EditFormController from './edit-form';
      export default EditFormController.extend({
        actions: {
          lookupWindowCustomProperties({ relationName, projection }) {
            if (relationName === 'author' && projection === 'UserL') {
              return {
                filterButton: true,
                filterByAnyWord: true,
                enableFilters: true,
                refreshButton: true,
                perPage: 25,
              };
            }
          },
        },
      });
      ```

      ```handlebars
      <!-- app/templates/post.hbs -->
      {{flexberry-lookup
        componentName="AuthorLookup"
        choose="showLookupDialog"
        remove="removeLookupValue"
        value=model.author
        projection="UserL"
        relationName="author"
        displayAttributeName="name"
        title="Author"
        placeholder="Not select"
        chooseText="Select"
        removeText="Clear"
        lookupWindowCustomProperties=(action "getLookupFolvProperties")
      }}
      ```

    @property _lookupWindowCustomPropertiesData
    @type Object
    @private
  */
  _lookupWindowCustomPropertiesData: Ember.computed(
    'projection',
    'relationName',
    'lookupWindowCustomProperties',
    function() {
      let lookupWindowCustomProperties = this.get('lookupWindowCustomProperties');
      if (lookupWindowCustomProperties) {
        let result = lookupWindowCustomProperties({
          relationName: this.get('relationName'),
          projection: this.get('projection'),
          componentName: this.get('componentName')
        });

        return result;
      }

      return undefined;
    }),

  /**
    Object with lookup properties to send on choose action.

    @property chooseData
    @type Object
    @readOnly
  */
  chooseData: Ember.computed(
    'projection',
    'relationName',
    'title',
    'lookupLimitPredicate',
    'relatedModel',
    '_lookupWindowCustomPropertiesData',
    function() {
      let perPage = this.get('userSettings').getCurrentPerPage(this.get('folvComponentName'));
      return {
        projection: this.get('projection'),
        relationName: this.get('relationName'),
        title: this.get('title'),
        predicate: this.get('lookupLimitPredicate'),
        modelToLookup: this.get('relatedModel'),
        lookupWindowCustomPropertiesData: this.get('_lookupWindowCustomPropertiesData'),
        componentName: this.get('componentName'),
        notUseUserSettings: this.get('notUseUserSettings'),
        perPage: perPage || this.get('perPage'),
        folvComponentName: this.get('folvComponentName'),

        //TODO: move to modal settings.
        sizeClass: this.get('sizeClass')
      };
    }),

  /**
    Object with lookup properties to send on remove action.

    @property removeData
    @type Object
    @readOnly
  */
  removeData: Ember.computed('relationName', 'relatedModel', function() {
    return {
      relationName: this.get('relationName'),
      modelToLookup: this.get('relatedModel')
    };
  }),

  /**
    Current store. Used for loading data for autocomplete and for dropdown.

    @property store
    @type DS.Store
    @readOnly
  */
  store: Ember.inject.service('store'),

  /**
    The user settings service.

    @property userSettings
    @type UserSettingsService
  */
  userSettings: Ember.inject.service('user-settings'),

  /**
    Name of the attribute of the model to display for the user.
    Is required for autocomplete and dropdown modes.

    @property displayAttributeName
    @type String
    @default null
  */
  displayAttributeName: null,

  /**
    Name of the attribute of the model to display for the user
    for hidden attribute by master.
    Is required for autocomplete and dropdown modes.

    @property autocompleteOrder
    @type String
    @default null
  */
  autocompleteOrder: null,

  /**
    Current selected instance of the model.

    @property value
    @type Object
  */
  value: undefined,

  /**
    Flag indicating whether a modal dialog is open.

    @property modalIsShow
    @type Boolean
    @default false
  */
  modalIsShow: false,

  /**
    Flag indicating whether a modal dialog starts to show.
    Needs for add loading indicator for choose button.

    @property modalIsStartToShow
    @type Boolean
    @default false
  */
  modalIsStartToShow: false,

  /**
    Flag: indicates whether a modal dialog will be shown soon.

    @property modalIsBeforeToShow
    @type Boolean
    @default false
  */
  modalIsBeforeToShow: false,

  /**
    Service that triggers lookup events.

    @property lookupEventsService
    @type Service
  */
  lookupEventsService: Ember.inject.service('lookup-events'),

  /**
    Text that displayed for the user as representation of currently selected value.
    This property is binded to the view and can be changed by user (it won't be applied to model automatically).

    @property displayValue
    @type String
    @readOnly
  */
  displayValue: Ember.computed('value', function() {
    return this._buildDisplayValue();
  }),

  /**
    Standard CSS class names to apply to the view's outer element.
    [More info](http://emberjs.com/api/classes/Ember.Component.html#property_classNames).

    @property classNames
    @type Array
    @readOnly
  */
  classNames: ['flexberry-lookup'],

  /**
    A list of properties of the view to apply as class names.
    [More info](http://emberjs.com/api/classes/Ember.Component.html#property_classNameBindings).

    @property classNameBindings
    @type Array
    @readOnly
  */
  classNameBindings: ['autocompleteClass', 'isActive:active'],

  /**
    Flag: indicates whether component is active or not.
    Used to highlight component before data loading operation will be started.

    @property isActive
    @type Boolean
    @default false
  */
  isActive: false,

  /**
    Flag: indicates whether component is in blocked state now.

    @property isBlocked
    @type Boolean
    @readOnly
  */
  isBlocked: Ember.computed('modalIsBeforeToShow', 'modalIsStartToShow', 'modalIsShow', function() {
    return this.get('modalIsBeforeToShow') || this.get('modalIsStartToShow') || this.get('modalIsShow');
  }),

  /**
    Used to identify lookup on the page.

    @property componentName
    @type String
  */
  componentName: undefined,

  /**
    Semantic-ui settings for dropdown.
    For more information see [semantic-ui](http://semantic-ui.com/modules/dropdown.html#/settings)
  */
  on: 'click',
  allowReselection: false,
  allowAdditions: false,
  hideAdditions: true,
  minCharacters: 1,
  match: 'both',
  selectOnKeydown: true,
  forceSelection: true,
  allowCategorySelection: false,
  direction: 'auto',
  keepOnScreen: true,
  fullTextSearch: false,
  preserveHTML: true,
  sortSelect: false,
  showOnFocus: true,
  allowTab: true,
  transition: 'auto',
  duration: 200,

  actions: {
    /**
      Open window for select value.

      @method actions.choose
      @param {Object} chooseData
    */
    choose(chooseData) {
      if (this.get('readonly') || this.get('isBlocked')) {
        return;
      }

      let componentName = this.get('componentName');
      if (!componentName) {
        Ember.warn('`componentName` of flexberry-lookup is undefined.', false, { id: 'ember-flexberry-debug.flexberry-lookup.component-name-is-not-defined' });
      } else {
        // Show choose button spinner.
        this.get('lookupEventsService').lookupDialogOnShowTrigger(componentName);
      }

      // Set state to active to add 'active' css-class.
      this.set('isActive', true);

      // Signalize that modal dialog will be shown soon.
      this.set('modalIsBeforeToShow', true);

      // Send 'choose' action after 'active' css-class will be completely added into component's DOM-element.
      Ember.run.later(() => {
        this.sendAction('choose', chooseData);
        this.set('isActive', false);
      }, 300);
    },

    /**
      Clear current value.

      @method actions.remove
      @param {Object} removeData
    */
    remove(removeData) {
      if (this.get('readonly')) {
        return;
      }

      this.sendAction('remove', removeData);
    },

    /**
      Show window for select value.

      @method actions.preview
    */
    preview() {
      let previewFormRoute = this.get('previewFormRoute');
      if (Ember.isNone(previewFormRoute)) {
        throw new Error('\`previewFormRoute\` is undefined.');
      }

      let relatedModel = this.get('relatedModel');
      let relationName = this.get('relationName');
      let relationModelName = getRelationType(relatedModel, relationName);

      let thisRouteName = this.get('currentController.routeName');
      let thisRecordId = this.get('relatedModel.id');
      let transitionOptions = {
        queryParams: {
          readonly: true,
          parentParameters: {
            parentRoute: thisRouteName,
            parentRouteRecordId: thisRecordId
          }
        }
      };

      let previewData = {
        recordId: this.get('value.id'),
        transitionRoute: previewFormRoute,
        transitionOptions: transitionOptions,
        showInSeparateRoute: this.get('previewOnSeparateRoute'),
        modelName: relationModelName,
        controller: this.get('controllerForPreview'),
        projection: this.get('previewFormProjection')
      };

      this.sendAction('preview', previewData);
    }
  },

  /**
    An overridable method called when objects are instantiated.
    For more information see [init](http://emberjs.com/api/classes/Ember.View.html#method_init) method of [Ember.View](http://emberjs.com/api/classes/Ember.View.html).
  */
  init() {

    this._super(...arguments);

    this.get('lookupEventsService').on('lookupDialogOnShow', this, this._setModalIsStartToShow);
    this.get('lookupEventsService').on('lookupDialogOnVisible', this, this._setModalIsVisible);
    this.get('lookupEventsService').on('lookupDialogOnHidden', this, this._setModalIsHidden);

    // TODO: This is necessary because of incomprehensible one-way binding on new detail form, perhaps the truth is out there, but I did not find it.
    this.addObserver('value', this, this._valueObserver);
    this.addObserver('displayAttributeName', this, this._valueObserver);
    this.addObserver(`relatedModel.${this.get('relationName')}`, this, this._valueObserver);
  },

  /**
    It seems to me a mistake here, it should be [willDestroyElement](http://emberjs.com/api/classes/Ember.Component.html#event_willDestroyElement).
    # WRANING!

    @method didDestroyElement
  */
  didDestroyElement() {
    this._super(...arguments);
    this.removeObserver('i18n.locale', this, this._languageReinit);
  },

  /**
    Called when the element of the view has been inserted into the DOM or after the view was re-rendered.
    [More info](http://emberjs.com/api/classes/Ember.Component.html#event_didInsertElement).

    @method didInsertElement
  */
  didInsertElement() {
    this._super(...arguments);
    this.addObserver('i18n.locale', this, this._languageReinit);
  },

  /**
    Called after a component has been rendered, both on initial render and in subsequent rerenders.
    [More info](http://emberjs.com/api/classes/Ember.Component.html#event_didRender).

    @method didRender
  */
  didRender() {
    this._super(...arguments);

    let isAutocomplete = this.get('autocomplete');
    let isDropdown = this.get('dropdown');
    if (isAutocomplete && isDropdown) {
      throw new Error('Component flexberry-lookup should not have both flags \'autocomplete\' and \'dropdown\' enabled.');
    }

    let cachedDropdownValue = this.get('_cachedDropdownValue');
    let cachedAutocompleteValue = this.get('_cachedAutocompleteValue');

    if (isAutocomplete && !cachedAutocompleteValue) {
      this._onAutocomplete();
    } else if (isDropdown && !cachedDropdownValue) {
      this._onDropdown();
    }

    this.set('_cachedDropdownValue', isDropdown);
    this.set('_cachedAutocompleteValue', isAutocomplete);
  },

  /**
    Override to implement teardown.
    For more information see [willDestroy](http://emberjs.com/api/classes/Ember.Component.html#method_willDestroy) method of [Ember.Component](http://emberjs.com/api/classes/Ember.Component.html).
  */
  willDestroy() {
    this._super(...arguments);
    this.get('lookupEventsService').off('lookupDialogOnShow', this, this._setModalIsStartToShow);
    this.get('lookupEventsService').off('lookupDialogOnVisible', this, this._setModalIsVisible);
    this.get('lookupEventsService').off('lookupDialogOnHidden', this, this._setModalIsHidden);

    // TODO: This is necessary because of incomprehensible one-way binding on new detail form, perhaps the truth is out there, but I did not find it.
    this.removeObserver('value', this, this._valueObserver);
    this.removeObserver('displayAttributeName', this, this._valueObserver);
    this.removeObserver(`relatedModel.${this.get('relationName')}`, this, this._valueObserver);
  },

  /**
    Additional observer of value and `relatedModel.relationName` change, updates `displayValue`.

    @method _valueObserver
    @private
  */
  _valueObserver() {
    this.set('displayValue', this._buildDisplayValue());
  },

  /**
    Set the value for the property `modalIsStartToShow`.

    @method _setModalIsStartToShow
    @private
  */
  _setModalIsStartToShow(componentName) {
    if (this.get('componentName') === componentName) {
      this.set('modalIsBeforeToShow', false);
      this.set('modalIsStartToShow', true);
    }
  },

  /**
    Set the value for the property `modalIsShow` & `modalIsStartToShow`.

    @method _setModalIsVisible
    @private
  */
  _setModalIsVisible(componentName, lookupDialog) {
    if (this.get('componentName') === componentName) {
      this.set('modalIsBeforeToShow', false);
      this.set('modalIsShow', true);
      this.set('modalIsStartToShow', false);
    }
  },

  /**
    Set the value for the property `modalIsShow`.

    @method _setModalIsHidden
    @private
  */
  _setModalIsHidden(componentName) {
    if (this.get('componentName') === componentName) {
      this.set('modalIsBeforeToShow', false);
      this.set('modalIsShow', false);
      this.set('modalIsStartToShow', false);
    }
  },

  /**
    Initialize component with autocomplete mode.

    @method _onAutocomplete
    @private
  */
  _onAutocomplete() {
    let _this = this;
    let store = this.get('store');
    let relatedModel = this.get('relatedModel');

    let relationName = this.get('relationName');
    if (!relationName) {
      throw new Error('relationName is not defined.');
    }

    let relationModelName = getRelationType(relatedModel, relationName);

    let displayAttributeName = this.get('displayAttributeName');
    let autocompleteOrder = this.get('autocompleteOrder');
    if (!displayAttributeName) {
      throw new Error('\`displayAttributeName\` is required property for autocomplete mode in \`flexberry-lookup\`.');
    }

    let minCharacters = this.get('minCharacters');
    if (!minCharacters || typeof (minCharacters) !== 'number' || minCharacters <= 0) {
      throw new Error('minCharacters has wrong value.');
    }

    let maxResults = this.get('maxResults');
    if (!maxResults || typeof (maxResults) !== 'number' || maxResults <= 0) {
      throw new Error('maxResults has wrong value.');
    }

    let state;
    let i18n = _this.get('i18n');
    this.$().search({
      minCharacters: minCharacters,
      maxResults: maxResults + 1,
      cache: false,
      templates: {
        message: function(message, type) {
          return '<div class="message empty"><div class="header">' +
          i18n.t('components.flexberry-lookup.dropdown.messages.noResultsHeader').string +
          '</div><div class="description">' +
          i18n.t('components.flexberry-lookup.dropdown.messages.noResults').string +
          '</div></div>';
        }
      },
      apiSettings: {
        /**
          Mocks call to the data source,
          Uses query language and store for loading data explicitly.

          @param {Object} settings
          @param {Function} callback
        */
        responseAsync(settings, callback) {
          // Prevent async data-request from being sent in readonly mode.
          if (_this.get('readonly')) {
            return;
          }

          let builder;
          if (autocompleteOrder) {
            builder = new Builder(store, relationModelName)
            .select(displayAttributeName).orderBy(`${autocompleteOrder}`);
          } else {
            builder = new Builder(store, relationModelName)
            .select(displayAttributeName)
            .orderBy(`${displayAttributeName} ${_this.get('sorting')}`);
          }

          let autocompletePredicate = settings.urlData.query ?
                                      new StringPredicate(displayAttributeName).contains(settings.urlData.query) :
                                      undefined;
          let resultPredicate = _this._conjuctPredicates(_this.get('lookupLimitPredicate'), autocompletePredicate);
          if (resultPredicate) {
            builder.where(resultPredicate);
          }

          let maxRes = _this.get('maxResults');
          let iCount = 1;
          builder.top(maxRes + 1);
          builder.count();

          Ember.run(() => {
            store.query(relationModelName, builder.build()).then((records) => {
              callback({
                success: true,
                results: records.map(i => {
                  let attributeName = i.get(displayAttributeName);
                  if (iCount > maxRes && records.meta.count > maxRes) {
                    return {
                      title: '...'
                    };
                  } else {
                    iCount += 1;
                    return {
                      title: attributeName,
                      instance: i
                    };
                  }
                })
              });
            }, () => {
              callback({ success: false });
            });
          });
        }
      },

      /**
       * Handles opening of the autocomplete list.
       * Sets current state (taht autocomplete list is opened) for future purposes.
       */
      onResultsOpen() {
        state = 'opened';

        Ember.run(() => {
          Ember.debug(`Flexberry Lookup::autocomplete state = ${state}`);
        });
      },

      /**
       * Handles selection of item from the autocomplete list.
       * Saves selected model and notifies the controller.
       *
       * @param {Object} result Item from array of objects, built in `responseAsync`.
       */
      onSelect(result) {
        state = 'selected';

        Ember.run(() => {
          Ember.debug(`Flexberry Lookup::autocomplete state = ${state}; result = ${result}`);

          _this.set('value', result.instance);
          _this.get('currentController').send(_this.get('updateLookupAction'),
            {
              relationName: relationName,
              modelToLookup: relatedModel,
              newRelationValue: result.instance
            });
        });
      },

      /**
       * Handles closing of the autocomplete list.
       * Restores display text if nothing has been selected.
       */
      onResultsClose() {
        // Set displayValue directly because value hasn'been changes
        // and Ember won't change computed property.

        if (state !== 'selected') {
          if (_this.get('displayValue')) {
            _this.set('displayValue', _this._buildDisplayValue());
          } else {
            _this.sendAction('remove', _this.get('removeData'));
          }
        }

        state = 'closed';

        Ember.run(() => {
          Ember.debug(`Flexberry Lookup::autocomplete state = ${state}`);
        });
      }
    });
  },

  /**
    Initialize component with dropdown mode.

    @method _onDropdown
    @private
  */
  _onDropdown() {
    let _this = this;
    let store = this.get('store');

    let relatedModel = this.get('relatedModel');
    let relationName = this.get('relationName');
    if (!relationName) {
      throw new Error('relationName is not defined.');
    }

    let relationModelName = getRelationType(relatedModel, relationName);
    let minCharacters = this.get('minCharacters');
    let dropdownIsSearch = this.get('dropdownIsSearch');

    let displayAttributeName = this.get('displayAttributeName');
    if (!displayAttributeName) {
      throw new Error(' \`displayAttributeName\` is required property for dropdown mode in \`flexberry-lookup\`.');
    }

    let i18n = _this.get('i18n');
    this.$('.flexberry-dropdown').dropdown({
      minCharacters: dropdownIsSearch ? minCharacters : 0,
      cache: false,
      on: this.get('on'),
      allowReselection: this.get('allowReselection'),
      allowAdditions: this.get('allowAdditions'),
      hideAdditions: this.get('hideAdditions'),
      match: this.get('match'),
      selectOnKeydown: this.get('selectOnKeydown'),
      forceSelection: this.get('forceSelection'),
      allowCategorySelection: this.get('allowCategorySelection'),
      direction: this.get('direction'),
      keepOnScreen: this.get('keepOnScreen'),
      fullTextSearch: this.get('fullTextSearch'),
      preserveHTML: this.get('preserveHTML'),
      sortSelect: this.get('sortSelect'),
      showOnFocus: this.get('showOnFocus'),
      allowTab: this.get('allowTab'),
      transition: this.get('transition'),
      duration: this.get('duration'),
      message: {
        noResults: i18n.t('components.flexberry-lookup.dropdown.messages.noResults').string
      },
      apiSettings: {
        responseAsync(settings, callback) {
          console.log('load');
          let builder = new Builder(store, relationModelName)
            .select(displayAttributeName)
            .orderBy(`${displayAttributeName} ${_this.get('sorting')}`);

          let autocompletePredicate = settings.urlData.query ?
                                      new StringPredicate(displayAttributeName).contains(settings.urlData.query) :
                                      undefined;
          let resultPredicate = _this._conjuctPredicates(_this.get('lookupLimitPredicate'), autocompletePredicate);
          if (resultPredicate) {
            builder.where(resultPredicate);
          }

          Ember.run(() => {
            store.query(relationModelName, builder.build()).then((records) => {
              // We have to cache data because dropdown component sets text as value and we lose object value.
              let resultArray = [];
              let results = records.map((i) => {
                let attributeName = i.get(displayAttributeName);
                resultArray[i.id] = i;
                return {
                  name: attributeName,
                  value: i.id
                };
              });

              if (!_this.get('required')) {
                results.unshift({ name: _this.get('placeholder'), value: null });
                resultArray['null'] = null;
              }

              callback({ success: true, results: results });
              _this.set('_cachedDropdownValues', resultArray);
            }, () => {
              callback({ success: false });
            });
          });
        }
      },
      onChange(value) {
        let newValue = value;
        if (value) {
          let cachedValues = _this.get('_cachedDropdownValues');
          let cachedValuesContainsVlue = cachedValues && (cachedValues[value] === null || cachedValues[value]);
          Ember.assert('Can\'t find selected dropdown value among cached values.', cachedValuesContainsVlue);
          if (cachedValuesContainsVlue) {
            newValue = cachedValues[value];
          }
        }

        _this.get('currentController').send(_this.get('updateLookupAction'),
          {
            relationName: relationName,
            modelToLookup: relatedModel,
            newRelationValue: newValue
          });
      }
    });
  },

  /**
    Builds display text by selected model.

    @method _buildDisplayValue
    @returns {String}
    @private
  */
  _buildDisplayValue() {
    let selectedModel = this.get('value');
    let displayAttributeName = this.get('displayAttributeName');
    if (!selectedModel) {
      return '';
    }

    if (!displayAttributeName) {
      Ember.warn('\`displayAttributeName\` is not defined.', false, { id: 'ember-flexberry-debug.flexberry-lookup.display-attribute-name-is-not-defined' });
      return '';
    }

    return selectedModel.get(displayAttributeName);
  },

  /**
    Concatenates predicates.

    @method _conjuctPredicates
    @param {BasePredicate} limitPredicate The first predicate to concatenate.
    @param {BasePredicate} autocompletePredicate The second predicate to concatenate.
    @return {BasePredicate} Concatenation of two predicates.
    @throws {Error} Throws error if any of parameter predicates has wrong type.
  */
  _conjuctPredicates(limitPredicate, autocompletePredicate) {
    if (limitPredicate && !(limitPredicate instanceof BasePredicate)) {
      throw new Error('Limit predicate is not correct. It has to be instance of BasePredicate.');
    }

    if (autocompletePredicate && !(autocompletePredicate instanceof BasePredicate)) {
      throw new Error('Autocomplete predicate is not correct. It has to be instance of BasePredicate.');
    }

    let resultPredicate = (limitPredicate && autocompletePredicate) ?
                          new ComplexPredicate(Condition.And, limitPredicate, autocompletePredicate) :
                          (limitPredicate ?
                            limitPredicate :
                            (autocompletePredicate ?
                              autocompletePredicate :
                              undefined));
    return resultPredicate;
  },

  /**
    Handles changing current locale.
    It reinits autocomplete or dropdown mode (depending on flag) in order to localize messages.

    @method _languageReinit
    @private
  */
  _languageReinit() {
    if (this.get('autocomplete')) {
      this._onAutocomplete();
    } else if (this.get('dropdown')) {
      this._onDropdown();
    }
  }
});
