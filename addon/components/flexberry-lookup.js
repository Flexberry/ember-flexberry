/**
  @module ember-flexberry
*/

import { assert, warn, debug } from '@ember/debug';
import { inject as service } from '@ember/service';
import { computed, observer, get } from '@ember/object';
import { later, run, once } from '@ember/runloop';
import { merge } from '@ember/polyfills';
import { isNone } from '@ember/utils';
import { on } from '@ember/object/evented';
import { A } from '@ember/array';
import FlexberryBaseComponent from './flexberry-base-component';

import { translationMacro as t } from 'ember-i18n';
import { getRelationType } from 'ember-flexberry-data/utils/model-functions';
import Builder from 'ember-flexberry-data/query/builder';
import Condition from 'ember-flexberry-data/query/condition';
import { BasePredicate, SimplePredicate, ComplexPredicate, StringPredicate } from 'ember-flexberry-data/query/predicate';

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
      choose=(action "showLookupDialog")
      remove=(action "removeLookupValue")
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
    CSS classes for flexberry-lookup at dropdown mode.

    @property dropdownClass
    @type String
  */
  dropdownClass: undefined,

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

  /* eslint-disable  ember/no-on-calls-in-components */
  /**
    Handles changes in dropdown.

    @method _dropdownObserver
    @private
  */
  _dropdownObserver: on('init', observer('dropdown', function() {
    if (this.get('dropdown')) {
      this._onDropdown();
    }
  })),
  /* eslint-enable  ember/no-on-calls-in-components */

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
    Flag to fill value by limitPredicate.

    @property autofillByLimit
    @type Boolean
    @default false
  */
  autofillByLimit: false,

  /* eslint-disable  ember/no-on-calls-in-components */
  /**
    Observer on 'autofillByLimit'.

    @property _autofillByLimitObserver
  */
  _autofillByLimitObserver: on('init', observer('autofillByLimit', function() {
    if (this.get('autofillByLimit')) {
      this.addObserver('relatedModel', this, this._autofillByLimitObserverFunction);
      this.addObserver('relationName', this, this._autofillByLimitObserverFunction);
      this.addObserver('lookupLimitPredicate', this, this._autofillByLimitObserverFunction);
      this.addObserver('lookupAdditionalLimitFunction', this, this._autofillByLimitObserverFunction);
    } else {
      this.removeObserver('relatedModel', this, this._autofillByLimitObserverFunction);
      this.removeObserver('relationName', this, this._autofillByLimitObserverFunction);
      this.removeObserver('lookupLimitPredicate', this, this._autofillByLimitObserverFunction);
      this.removeObserver('lookupAdditionalLimitFunction', this, this._autofillByLimitObserverFunction);
    }
  })),
  /* eslint-enable  ember/no-on-calls-in-components */

  /**
    Classes by property of autocomplete.

    @property autocompleteClass
    @type String
    @readOnly
  */
  autocompleteClass: computed('autocomplete', function() {
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
  folvComponentName: computed('componentName', function() {
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
    Flag for remove autocomplete value if it's not in the results (remove when false).

    @property autocompletePersistValue
    @type Boolean
    @default false
  */
  autocompletePersistValue: false,

  /**
    Stores autocomplete value, when autocompletePersistValue=true and lookup value clearing.

    @property autocompletePersistValueCache
    @type String
    @default undefined
  */
  autocompletePersistValueCache: undefined,

  /**
    Limit function on lookup.
    It should not be just a string, it has to be predicate function (otherwise an exception will be thrown).

    @property lookupLimitPredicate
    @type BasePredicate
    @default undefined
  */
  lookupLimitPredicate: undefined,

  /**
    Indicates wheter lookup dilog's table in hierarchical mode.

    @property inHierarchicalMode
    @type Boolean
    @default false
  */
  inHierarchicalMode: false,

  /**
    Hierarchical attribute.

    @property hierarchicalAttribute
    @type String
    @default undefined
  */
  hierarchicalAttribute: undefined,

  /**
    Function of limit function for lookup in GroupEdit.
    It should not be function return BasePredicate.

    @example
      ```javascript
        lookupAdditionalLimitFunction = function (relationModel) {
        return new StringPredicate('LookUpField').contains(relationModel.get('GroupEditField'));
      };
      ```

    @property lookupAdditionalLimitFunction
    @type Function
    @default undefined
  */
  lookupAdditionalLimitFunction: undefined,

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
        choose=(action "showLookupDialog")
        remove=(action "removeLookupValue")
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
  _lookupWindowCustomPropertiesData: computed(
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
  chooseData: computed(
    'projection',
    'relationName',
    'title',
    'lookupLimitPredicate',
    'relatedModel',
    '_lookupWindowCustomPropertiesData',
    'inHierarchicalMode',
    'hierarchicalAttribute',
    function() {
      let perPage = this.get('userSettings').getCurrentPerPage(this.get('folvComponentName'));
      return {
        projection: this.get('projection'),
        relationName: this.get('relationName'),
        title: this.get('title'),
        predicate: this._conjuctPredicates(this.get('lookupLimitPredicate'), this.get('lookupAdditionalLimitFunction')),
        modelToLookup: this.get('relatedModel'),
        lookupWindowCustomPropertiesData: this.get('_lookupWindowCustomPropertiesData'),
        componentName: this.get('componentName'),
        notUseUserSettings: this.get('notUseUserSettings'),
        perPage: perPage || this.get('perPage'),
        folvComponentName: this.get('folvComponentName'),
        inHierarchicalMode: this.get('inHierarchicalMode'),
        hierarchicalAttribute: this.get('hierarchicalAttribute'),

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
  removeData: computed('relationName', 'relatedModel', function() {
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
  store: service('store'),

  /**
    The user settings service.

    @property userSettings
    @type UserSettingsService
  */
  userSettings: service('user-settings'),

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
    Projection name for autocomplete query.

    @property autocompleteProjection
    @type String
    @default undefined
  */
  autocompleteProjection: undefined,

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
  lookupEventsService: service('lookup-events'),

  /**
    Text that displayed for the user as representation of currently selected value.
    This property is binded to the view and can be changed by user (it won't be applied to model automatically).

    @property displayValue
    @type String
  */
  displayValue: undefined,

  /**
    Standard CSS class names to apply to the view's outer element.
    [More info](https://emberjs.com/api/ember/release/classes/Component#property_classNames).

    @property classNames
    @type Array
    @readOnly
  */
  classNames: ['flexberry-lookup'],

  /**
    A list of properties of the view to apply as class names.
    [More info](https://emberjs.com/api/ember/release/classes/Component#property_classNameBindings).

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
  isBlocked: computed('modalIsBeforeToShow', 'modalIsStartToShow', 'modalIsShow', function() {
    return this.get('modalIsBeforeToShow') || this.get('modalIsStartToShow') || this.get('modalIsShow');
  }),

  /**
    Used to identify lookup on the page.

    @property componentName
    @type String
  */
  componentName: undefined,

  /**
    Autocomplete settings.
  */
  minCharacters: 1,

  /**
    Semantic-ui settings for dropdown.
    For more information see [semantic-ui](http://semantic-ui.com/modules/dropdown.html#/settings)
  */
  dropdownSettings: undefined,

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
        warn('`componentName` of flexberry-lookup is undefined.', false, { id: 'ember-flexberry-debug.flexberry-lookup.component-name-is-not-defined' });
      } else {
        // Show choose button spinner.
        this.get('lookupEventsService').lookupDialogOnShowTrigger(componentName);
      }

      // If in groupedit with lookupAdditionalLimitFunction reread chooseData.predicate.
      if (this.get('lookupAdditionalLimitFunction')) {
        chooseData.predicate = this._conjuctPredicates(this.get('lookupLimitPredicate'), this.get('lookupAdditionalLimitFunction'));
      }

      // Set state to active to add 'active' css-class.
      this.set('isActive', true);

      // Signalize that modal dialog will be shown soon.
      this.set('modalIsBeforeToShow', true);

      // Send 'choose' action after 'active' css-class will be completely added into component's DOM-element.
      later(() => {
        let choose = this.get('choose');
        if (choose instanceof Function) {
          choose(chooseData);
        } else {
          this.get('currentController').send(choose, chooseData);
        }

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

      if (this.get('autocompletePersistValue')) {
        this.set('autocompletePersistValueCache', undefined);
        this.set('displayValue', undefined);
      }

      let remove = this.get('remove');
      if (remove instanceof Function) {
        remove(removeData);
      } else {
        this.get('currentController').send(remove, removeData);
      }
    },

    /**
      Show window for select value.

      @method actions.preview
    */
    preview() {
      let previewFormRoute = this.get('previewFormRoute');
      if (isNone(previewFormRoute)) {
        throw new Error('`previewFormRoute` is undefined.');
      }

      let relatedModel = this.get('relatedModel');
      let relationName = this.get('relationName');
      let relationModelName = getRelationType(relatedModel, relationName);

      let thisRouteName = this.get('currentController.routeName');
      let thisRecordId = this.get('relatedModel.id');
      let transitionOptions = {
        queryParams: {
          readonly: true,
          parentRoute: thisRouteName,
          parentRouteRecordId: thisRecordId
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

      /* eslint-disable ember/closure-actions */
      this.sendAction('preview', previewData);
      /* eslint-enable ember/closure-actions */
    }
  },

  /**
    An overridable method called when objects are instantiated.
    For more information see [init](https://emberjs.com/api/ember/release/classes/EmberObject/methods/init?anchor=init) method of [EmberObject](https://emberjs.com/api/ember/release/classes/EmberObject).
  */
  init() {
    this._super(...arguments);

    this.get('lookupEventsService').on('lookupDialogOnShow', this, this._setModalIsStartToShow);
    this.get('lookupEventsService').on('lookupDialogOnVisible', this, this._setModalIsVisible);
    this.get('lookupEventsService').on('lookupDialogOnHidden', this, this._setModalIsHidden);

    if (this.get('autocompletePersistValue') && isNone(this.get('value'))) {
      this.set('autocompletePersistValueCache', this.get('displayValue'));
    }

    this._valueObserver();

    if (this.get('autofillByLimit')) {
      this._onAutofillByLimit();
    }
  },

  /**
    Observe lookup value changes.
  */
  valueObserver: observer('value', 'displayAttributeName', function() { once(this, '_valueObserver'); }),

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
    [More info](https://emberjs.com/api/ember/release/classes/Component#event_didInsertElement).

    @method didInsertElement
  */
  didInsertElement() {
    this._super(...arguments);
    this.addObserver('i18n.locale', this, this._languageReinit);
  },

  /**
    Called after a component has been rendered, both on initial render and in subsequent rerenders.
    [More info](https://emberjs.com/api/ember/release/classes/Component#event_didRender).

    @method didRender
  */
  didRender() {
    this._super(...arguments);

    let isAutocomplete = this.get('autocomplete');
    let isDropdown = this.get('dropdown');
    if (isAutocomplete && isDropdown) {
      throw new Error('Component flexberry-lookup should not have both flags \'autocomplete\' and \'dropdown\' enabled.');
    }

    let cachedAutocompleteValue = this.get('_cachedAutocompleteValue');
    if (isAutocomplete && !cachedAutocompleteValue) {
      this._onAutocomplete();
    }

    this.set('_cachedDropdownValue', isDropdown);
    this.set('_cachedAutocompleteValue', isAutocomplete);
  },

  /**
    Override to implement teardown.
    For more information see [willDestroy](https://emberjs.com/api/ember/release/classes/Component#method_willDestroy) method of [Component](https://emberjs.com/api/ember/release/classes/Component).
  */
  willDestroy() {
    this._super(...arguments);
    this.get('lookupEventsService').off('lookupDialogOnShow', this, this._setModalIsStartToShow);
    this.get('lookupEventsService').off('lookupDialogOnVisible', this, this._setModalIsVisible);
    this.get('lookupEventsService').off('lookupDialogOnHidden', this, this._setModalIsHidden);
    if (this.get('autofillByLimit')) {
      this.removeObserver('relatedModel', this, this._autofillByLimitObserverFunction);
      this.removeObserver('relationName', this, this._autofillByLimitObserverFunction);
      this.removeObserver('lookupLimitPredicate', this, this._autofillByLimitObserverFunction);
      this.removeObserver('lookupAdditionalLimitFunction', this, this._autofillByLimitObserverFunction);
    }
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
  /* eslint-disable no-unused-vars */
  _setModalIsVisible(componentName, lookupDialog) {
    if (this.get('componentName') === componentName) {
      this.set('modalIsBeforeToShow', false);
      this.set('modalIsShow', true);
      this.set('modalIsStartToShow', false);
    }
  },
  /* eslint-enable no-unused-vars */

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
    if (!displayAttributeName) {
      throw new Error('`displayAttributeName` is required property for autocomplete mode in `flexberry-lookup`.');
    }

    let minCharacters = this.get('minCharacters');
    if (!minCharacters || typeof (minCharacters) !== 'number' || minCharacters <= 0) {
      throw new Error('minCharacters has wrong value.');
    }

    let maxResults = this.get('maxResults');
    if (!maxResults || typeof (maxResults) !== 'number' || maxResults <= 0) {
      throw new Error('maxResults has wrong value.');
    }

    // Add select first autocomplete result by enter click.
    this.$('input').keyup(function(event) {
      if (event.keyCode === 13) {
        let result = _this.$('div.results.transition.visible');
        let activeField = result.children('a.result.active');
        let resultField = result.children('a.result')[0];
        if (resultField && activeField.length === 0) {
          resultField.click();
        }
      }
    });

    let state;
    let i18n = _this.get('i18n');
    this.$().search({
      minCharacters: minCharacters,
      maxResults: maxResults + 1,
      cache: false,
      templates: {
        /* eslint-disable no-unused-vars */
        message: function(message, type) {
          return '<div class="message empty"><div class="header">' +
          i18n.t('components.flexberry-lookup.dropdown.messages.noResultsHeader').string +
          '</div><div class="description">' +
          i18n.t('components.flexberry-lookup.dropdown.messages.noResults').string +
          '</div></div>';
        }
        /* eslint-enable no-unused-vars */
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

          let autocompleteProjection = _this.get('autocompleteProjection');
          let autocompleteOrder = _this.get('autocompleteOrder');

          let builder = _this._createQueryBuilder(store, relationModelName, autocompleteProjection, autocompleteOrder);

          let autocompletePredicate = settings.urlData.query ?
                                      new StringPredicate(displayAttributeName).contains(settings.urlData.query) :
                                      undefined;
          let resultPredicate = _this._conjuctPredicates(_this.get('lookupLimitPredicate'), _this.get('lookupAdditionalLimitFunction'), autocompletePredicate);
          if (resultPredicate) {
            builder.where(resultPredicate);
          }

          let maxRes = _this.get('maxResults');
          let iCount = 1;
          builder.top(maxRes + 1);
          builder.count();

          run(() => {
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

        run(() => {
          debug(`Flexberry Lookup::autocomplete state = ${state}`);
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

        run(() => {
          debug(`Flexberry Lookup::autocomplete state = ${state}; result = ${result}`);

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
          let displayValue = _this.get('displayValue');
          if (displayValue) {
            if (_this.get('autocompletePersistValue')) {
              let builder = new Builder(store, relationModelName).select(displayAttributeName);

              let autocompletePredicate = new SimplePredicate(displayAttributeName, 'eq', displayValue);
              let resultPredicate = _this._conjuctPredicates(
                _this.get('lookupLimitPredicate'),
                _this.get('lookupAdditionalLimitFunction'),
                autocompletePredicate);
              if (resultPredicate) {
                builder.where(resultPredicate);
              }

              run(() => {
                store.query(relationModelName, builder.build()).then((records) => {
                  let record = records.objectAt(0);
                  if (isNone(record)) {
                    _this.set('autocompletePersistValueCache', displayValue);
                    _this.sendAction('remove', _this.get('removeData'));
                  } else {
                    _this.set('value', record);
                    _this.get('currentController').send(_this.get('updateLookupAction'),
                      {
                        relationName: relationName,
                        modelToLookup: relatedModel,
                        newRelationValue: record
                      });
                  }
                });
              });
            } else {
              _this.set('displayValue', _this._buildDisplayValue());
            }
          } else {
            _this.sendAction('remove', _this.get('removeData'));
          }
        }

        state = 'closed';

        run(() => {
          debug(`Flexberry Lookup::autocomplete state = ${state}`);
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
      throw new Error('`displayAttributeName` is required property for dropdown mode in `flexberry-lookup`.');
    }

    let i18n = _this.get('i18n');
    let defaultDropdownSettings = {
      minCharacters: dropdownIsSearch ? minCharacters : 0,
      cache: false,
      forceSelection: false,
      message: {
        noResults: i18n.t('components.flexberry-lookup.dropdown.messages.noResults').string
      },
      apiSettings: {
        responseAsync(settings, callback) {
          let projectionName = _this.get('projection');
          let builder = _this._createQueryBuilder(store, relationModelName, projectionName);

          let autocompletePredicate = settings.urlData.query ?
                                      new StringPredicate(displayAttributeName).contains(settings.urlData.query) :
                                      undefined;
          let resultPredicate = _this._conjuctPredicates(_this.get('lookupLimitPredicate'), _this.get('lookupAdditionalLimitFunction'), autocompletePredicate);
          if (resultPredicate) {
            builder.where(resultPredicate);
          }

          run(() => {
            store.query(relationModelName, builder.build()).then((records) => {
              // We have to cache data because dropdown component sets text as value and we lose object value.
              let resultArray = {};
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
          assert('Can\'t find selected dropdown value among cached values.', cachedValuesContainsVlue);
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
      },
      onHide() {
        _this.$('.flexberry-dropdown input.search').val('');
        _this.$('.flexberry-dropdown .text.filtered').removeClass('filtered');
      }
    };

    this.set('dropdownSettings', merge(defaultDropdownSettings, this.get('dropdownSettings') || {}));
  },

  /**
    Builds display text by selected model.

    @method _buildDisplayValue
    @returns {String}
    @private
  */
  _buildDisplayValue() {
    let autocompletePersistValueCache = this.get('autocompletePersistValueCache');
    if (autocompletePersistValueCache) {
      this.set('autocompletePersistValueCache', undefined);
    }

    let selectedModel = this.get('value');
    let displayAttributeName = this.get('displayAttributeName');
    if (!selectedModel) {
      return autocompletePersistValueCache ? autocompletePersistValueCache : '';
    }

    if (!displayAttributeName) {
      warn('`displayAttributeName` is not defined.', false, { id: 'ember-flexberry-debug.flexberry-lookup.display-attribute-name-is-not-defined' });
      return '';
    }

    return selectedModel.get(displayAttributeName);
  },

  /**
    Creates an instance of the Builder class with selection and sorting specified in the component parameters.

    @method _createQueryBuilder
    @param {DS.Store} store
    @param {String} modelName
    @param {String} projection
    @param {String} order
    @return {Builder}
  */
  _createQueryBuilder(store, modelName, projection, order) {
    let sorting = this.get('sorting');
    let displayAttributeName = this.get('displayAttributeName');

    let builder = new Builder(store, modelName);

    if (projection) {
      builder.selectByProjection(projection);
    } else {
      builder.select(displayAttributeName);
    }

    builder.orderBy(`${order ? order : `${displayAttributeName} ${sorting}`}`);

    return builder;
  },

  /**
    Concatenates predicates.

    @method _conjuctPredicates
    @param {BasePredicate} limitPredicate The first predicate to concatenate.
    @param {BasePredicate} autocompletePredicate The second predicate to concatenate.
    @param {Function} lookupAdditionalLimitFunction Function return BasePredicate to concatenate.
    @return {BasePredicate} Concatenation of two predicates.
    @throws {Error} Throws error if any of parameter predicates has wrong type.
  */
  _conjuctPredicates(limitPredicate, lookupAdditionalLimitFunction, autocompletePredicate) {
    let limitArray = A();

    if (limitPredicate) {
      if (limitPredicate instanceof BasePredicate) {
        limitArray.pushObject(limitPredicate);
      } else {
        throw new Error('Limit predicate is not correct. It has to be instance of BasePredicate.');
      }
    }

    if (autocompletePredicate) {
      if (autocompletePredicate instanceof BasePredicate) {
        limitArray.pushObject(autocompletePredicate);
      } else {
        throw new Error('Autocomplete predicate is not correct. It has to be instance of BasePredicate.');
      }
    }

    if (lookupAdditionalLimitFunction) {
      if ((lookupAdditionalLimitFunction instanceof Function)) {
        let compileAdditionakBasePredicate = lookupAdditionalLimitFunction(this.get('relatedModel'));
        if (compileAdditionakBasePredicate) {
          if (compileAdditionakBasePredicate instanceof BasePredicate) {
            limitArray.pushObject(compileAdditionakBasePredicate);
          } else {
            throw new Error('lookupAdditionalLimitFunction must return BasePredicate.');
          }
        }
      } else {
        throw new Error('lookupAdditionalLimitFunction must to be function.');
      }
    }

    if (limitArray.length > 1) {
      return new ComplexPredicate(Condition.And, ...limitArray);
    } else {
      return limitArray[0];
    }
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
  },

  /**
    Function for autofillByLimit observer.

    @method _autofillByLimitObserverFunction
    @private
  */
  _autofillByLimitObserverFunction() {
    once(this, '_onAutofillByLimit');
  },

  /**
    Handles changing properties affecting the sample.

    @method _onAutofillByLimit
    @private
  */
  _onAutofillByLimit() {
    if (this.get('readonly')) {
      return;
    }

    let _this = this;
    let relationName = this.get('relationName');
    if (!relationName) {
      throw new Error('relationName is not defined.');
    }

    let store = this.get('store');
    let relatedModel = this.get('relatedModel');
    let relationModelName = getRelationType(relatedModel, relationName);

    let builder = new Builder(store, relationModelName).selectByProjection(this.get('projection'));

    let lookupLimitPredicate = this._conjuctPredicates(this.get('lookupLimitPredicate'), this.get('lookupAdditionalLimitFunction'));
    if (lookupLimitPredicate) {
      builder.where(lookupLimitPredicate);
    }

    builder.top(2);
    store.query(relationModelName, builder.build()).then((records) => {
      if (get(records, 'length') === 1) {
        let record = records.objectAt(0);
        _this.set('value', record);
        _this.get('currentController').send(_this.get('updateLookupAction'),
          {
            relationName: relationName,
            modelToLookup: relatedModel,
            newRelationValue: record
          });
      }
    });
  }
});
