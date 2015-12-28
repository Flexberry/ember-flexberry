import Ember from 'ember';

export default Ember.Component.extend({
  placeholder: '(no value)',
  chooseText: 'Choose',
  removeText: 'X',

  projection: undefined,
  value: undefined,
  relationName: undefined,
  title: undefined,
  cssClass: undefined,

  /**
   * Function to limit accessible values.
   *
   * @property limitFunction
   * @type String
   * @default undefined
   */
  limitFunction: undefined,

  /**
   * Object with lookup properties to send on choose action.
   *
   * @property chooseData
   * @type Object
   */
  chooseData: Ember.computed('projection', 'relationName', 'title', 'limitFunction', function() {
    return {
      projection: this.get('projection'),
      relationName: this.get('relationName'),
      title: this.get('title'),
      limitFunction: this.get('limitFunction'),
      modelToLookup: undefined
    };
  }),

  readonly:  false,
  buttonToggleReadonlyVisible: false,

  init() {
    this._super();
    if (this.cssClass !== undefined) {
      var classes = this.cssClass.split(' ');
      for (var i = 0; i < classes.length; i++) {
        var classNameToSet = classes[i].trim();
        if (classNameToSet !== '') {
          if (this.classNames === undefined) {
            this.classNames = [];
          }

          this.classNames.push(classNameToSet);
        }
      }
    }
  },

  actions: {
    toggleReadonly() {
      this.toggleProperty('readonly');
    },
    choose: function(relationName, projection, title) {
      this.sendAction('choose', relationName, projection, title, undefined);
    },
    remove: function(relationName) {
      this.sendAction('remove', relationName, undefined);
    }
  }
});
