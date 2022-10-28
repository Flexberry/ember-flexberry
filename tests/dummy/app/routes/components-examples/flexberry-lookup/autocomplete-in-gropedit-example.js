import EditFormRoute from 'ember-flexberry/routes/edit-form';

export default EditFormRoute.extend({
/**
    Name of model projection to be used as record's properties limitation.

    @property modelProjection
    @type String
    @default 'SuggestionTypeE'
   */
  modelProjection: 'SuggestionTypeE',

  /**
    Returns model related to current route.

    @method model
   */
  /* eslint-disable no-unused-vars */
  model(params) {
    const store = this.get('store');
    const suggetionTypeRecord = store.createRecord('ember-flexberry-dummy-suggestion-type');
    const localizedType = store.createRecord('ember-flexberry-dummy-localized-suggestion-type');
    const localization = store.createRecord('ember-flexberry-dummy-localization');

    localization.set('name', 'testLoc');
    localizedType.set('name', 'test');
    localizedType.set('localization', localization);
    suggetionTypeRecord.localizedTypes.addObject(localizedType);

    return suggetionTypeRecord;
  }
  /* eslint-enable no-unused-vars */
});
