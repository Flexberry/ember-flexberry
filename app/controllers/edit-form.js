import Ember from 'ember';
import ValidationData from '../objects/validation-data';
import ErrorableControllerMixin from '../mixins/errorable-controller';

export default Ember.Controller.extend(ErrorableControllerMixin, {
  actions: {
    save: function() {
      this.send('dismissErrorMessages');
      let model = this.get('model');
      model.save().then(
        this._onSaveFulfilled.bind(this),
        this._onSaveRejected.bind(this));
    },

    close: function() {
      // TODO: нужно учитывать пэйджинг.
      // Без сервера не обойтись, наверное. Нужно определять, на какую страницу редиректить.
      // Либо редиректить на что-то типа /{parentRoute}/page/whichContains/{object id}, а контроллер/роут там далее разрулит, куда дальше послать редирект.
      this.transitionToRoute(this.get('parentRoute'));
    },

    showLookupDialog: function(relationName, projectionName) {
      if (!projectionName) {
        throw new Error('ProjectionName is undefined.');
      }

      let model = this.get('model');
      // get ember static function to get relation by name
      var relationshipsByName = Ember.get(model.constructor, 'relationshipsByName');
      // get relation property from model
      var relation = relationshipsByName.get(relationName);
      if (!relation) {
        throw new Error(`No relation with '${relationName}' name defined in '${model.constructor.typeKey}' model.`);
      }
      // get property type name
      var relatedToType = relation.type.typeKey;
      // get property type constructor by type name
      var relatedTypeConstructor = this.store.modelFor(relatedToType);
      // get a projection from related type model
      var projection = Ember.get(relatedTypeConstructor, 'projections')[projectionName];
      if (!projection) {
        throw new Error(`No projection with '${projectionName}' name defined in '${relatedToType}' model. `);
      }

      var controller = this.controllerFor('lookup-dialog')
        .clear()
        .set('modelProjection', projection)
        .set('saveTo', {
          model: model,
          propName: relationName
        });

      this.send('showModalDialog', 'lookup-dialog', {
        controller: controller,
        model: this.store.find(relatedToType, {
          __fetchingProjection: projection
        })
      });
    },

    removeLookupValue: function (relationName) {
      let model = this.get('model');
      model.set(relationName, undefined);

      // manually set isDirty flag, because its not working now when change relation props
      // no check for 'old' and 'new' lookup data equality, because ember will do it automatically after bug fix
      model.send('becomeDirty');
    }
  },

  _onSaveFulfilled: function() {
    alert('Saved');
  },

  _onSaveRejected: function(errorData) {
    if (errorData instanceof ValidationData) {
      this._throwValidationError(errorData);
      return;
    }

    let isAjaxError = errorData && errorData.hasOwnProperty('responseText');
    if (isAjaxError) {
      this._throwAjaxError(errorData);
      return;
    }

    throw new Error('Unknown error has been rejected.');
  },

  _throwValidationError: function(validationError) {
    if (validationError.anyErrors) {
      // TODO: more detail message about validation errors.
      this.send('addErrorMessage', 'There are validation errors.');
      alert('Save failed');
    } else if (validationError.noChanges) {
      alert('There are no changes');
    } else {
      throw new Error('Unknown validation error.');
    }
  },

  _throwAjaxError: function(ajaxError) {
    var respJson = ajaxError.responseJSON;
    Ember.assert('XMLHttpRequest has responseJSON property', respJson);

    if (respJson.error && respJson.error.message) {
      this.send('addErrorMessage', respJson.error.message);
    }

    alert('Save failed');
  }
});
