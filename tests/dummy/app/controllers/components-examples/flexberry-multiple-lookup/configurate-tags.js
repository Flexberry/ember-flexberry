import { get, set, computed } from '@ember/object';
import { A } from '@ember/array';
import { htmlSafe } from '@ember/string';
import { isNone } from '@ember/utils';
import EditFormController from 'ember-flexberry/controllers/edit-form';

export default EditFormController.extend({
  baseVoteModel: null,

  /**
    Configurate tags 'flexberry-multiple-lookup' component by value.

    @property configurateTagByValue
    @type String
  */
  configurateTagByValue: undefined,

  /**
    The tag can be deleted.

    @property canBeDeleted
    @type Boolean
  */
  canBeDeleted: true,

  /**
    The tag can be selected.

    @property canBeSelected
    @type Boolean
  */
  canBeSelected: true,

  /**
    Custom css classes for the tag.

    @property customClass
    @type String
  */
  customClass: undefined,

  /**
    Template text for 'flexberry-multiple-lookup' component.

    @property componentTemplateText
    @type String
  */
  componentTemplateText: computed(function() {
    return new htmlSafe(
      '{{flexberry-multiple-lookup<br>' +
      '  configurateTag=(action "configurateTag")<br>' +
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
      settingName: 'configurateTagByValue',
      settingType: 'string',
      settingDefaultValue: undefined,
      bindedControllerPropertieName: 'configurateTagByValue'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'canBeDeleted',
      settingType: 'boolean',
      settingDefaultValue: true,
      bindedControllerPropertieName: 'canBeDeleted'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'canBeSelected',
      settingType: 'boolean',
      settingDefaultValue: true,
      bindedControllerPropertieName: 'canBeSelected'
    });
    componentSettingsMetadata.pushObject({
      settingName: 'customClass',
      settingType: 'string',
      settingDefaultValue: undefined,
      bindedControllerPropertieName: 'customClass'
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
    },

    /**
      Configurate tags on the condition.
    */
    configurateTag(tagConfig, record) {
      if (get(record, 'author.name') === this.get('configurateTagByValue')) {
        set(tagConfig, 'canBeDeleted', this.get('canBeDeleted'));
        set(tagConfig, 'canBeSelected', this.get('canBeSelected'));
        set(tagConfig, 'customClass', this.get('customClass'));
      }
    }
  }
});
