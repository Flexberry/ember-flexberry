import { A } from '@ember/array';
import { htmlSafe } from '@ember/string';
import { computed } from '@ember/object';
import { isNone } from '@ember/utils';
import EditFormController from 'ember-flexberry/controllers/edit-form';

export default EditFormController.extend({
  /**
    Flag: indicates whether 'flexberry-multiple-lookup' component is in 'readonly' mode or not.

    @property readonly
    @type Boolean
   */
  readonly: false,

  chooseComponentVisibility: true,

  baseVoteModel: null,

  /**
    Template text for 'flexberry-multiple-lookup' component.

    @property componentTemplateText
    @type String
  */
  componentTemplateText: computed(function() {
    return new htmlSafe(
      '{{flexberry-multiple-lookup<br>' +
      '  componentName="MultipleLookupGroupedit"<br>' +
      '  folvComponentName="folvMultipleLookupGroupedit"<br>' +
      '  caption=(t "forms.components-examples.flexberry-multiple-lookup.multiple-lookup.lookup-caption")<br>' +
      '  choose="showLookupDialog"<br>' +
      '  add=(action "addMultipleValue")<br>' +
      '  delete=(action "deleteMultipleValue")<br>' +
      '  preview=(action "previewMultipleValue")<br>' +
      '  records=model.userVotes<br>' +
      '  value=baseVoteModel.author<br>' +
      '  isColumnMode=false<br>' +
      '  autocomplete=true<br>' +
      '  autocompleteProjection="PreviewExampleView"<br>' +
      '  relatedModel=baseVoteModel<br>' +
      '  relationName="author"<br>' +
      '  projection="PreviewExampleView"<br>' +
      '  displayAttributeName="name"<br>' +
      '  dynamicProperties=dynamicProperties<br>' +
      '  title=(t "forms.components-examples.flexberry-multiple-lookup.multiple-lookup.lookup-title")<br>' +
      '  lookupWindowCustomProperties=lookupWindowCustomProperties<br>' +
      '  chooseComponentVisibility=chooseComponentVisibility<br>' +
      '  readonly=readonly<br>' +
      '  usePaginationForAutocomplete=true<br>' +
      '}}');
  }),

  init() {
    this._super(...arguments);

    const store = this.get('store');

    this.set('baseVoteModel', store.createRecord('ember-flexberry-dummy-vote'));
  },

  /**
    Component settings metadata.

    @property componentSettingsMetadata
    @type Object[]
  */
  componentSettingsMetadata: computed(function() {
    let componentSettingsMetadata = A();
    componentSettingsMetadata.pushObject({
      settingName: 'chooseComponentVisibility',
      settingType: 'boolean',
      settingDefaultValue: true,
      bindedControllerPropertieName: 'chooseComponentVisibility'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'readonly',
      settingType: 'boolean',
      settingDefaultValue: false,
      bindedControllerPropertieName: 'readonly'
    });
    return componentSettingsMetadata;
  }),

  actions: {
    addMultipleValue(authorValue) {
      if (isNone(this.get('model.userVotes')
        .filterBy('isDeleted', false)
        .findBy('author.id', authorValue.get('id')))) {
        this.get('model.userVotes').addObject(
          this.get('store').createRecord('ember-flexberry-dummy-vote', {
            author: authorValue
          })
        );
      }
    },

    deleteMultipleValue(voteRecord) {
      voteRecord.deleteRecord();
    },

    previewMultipleValue(voteRecord) {
      window.open(this.get('target').generate('ember-flexberry-dummy-application-user-edit', voteRecord.get('author.id'), { queryParams: { readonly: true } }));
    }
  },
});
