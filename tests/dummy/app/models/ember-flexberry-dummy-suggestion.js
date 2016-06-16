import DS from 'ember-data';
import BaseModel from 'ember-flexberry/models/base';
import Proj from 'ember-flexberry-data';
import { translationMacro as t } from 'ember-i18n';

var Model = BaseModel.extend({
  address: DS.attr('string'),
  text: DS.attr('string'),
  votes: DS.attr('number'),
  moderated: DS.attr('boolean'),

  // This property is for flexberry-lookup component. No inverse relationship here.
  type: DS.belongsTo('ember-flexberry-dummy-suggestion-type', {
    inverse: null,
    async: false
  }),

  // This property is for flexberry-lookup component. No inverse relationship here.
  author: DS.belongsTo('ember-flexberry-dummy-application-user', {
    inverse: null, async: false
  }),

  // This property is for flexberry-lookup component. No inverse relationship here.
  editor1: DS.belongsTo('ember-flexberry-dummy-application-user', {
    inverse: null,
    async: false
  }),

  // This property is for flexberry-groupedit component.
  // Inverse relationship is necessary here.
  files: DS.hasMany('ember-flexberry-dummy-suggestion-file', {
    inverse: 'suggestion',
    async: false
  }),

  // This property is for flexberry-groupedit component.
  // Inverse relationship is necessary here.
  userVotes: DS.hasMany('ember-flexberry-dummy-vote', {
    inverse: 'suggestion',
    async: false
  }),

  // This property is for flexberry-groupedit component.
  // Inverse relationship is necessary here.
  comments: DS.hasMany('ember-flexberry-dummy-comment', {
    inverse: 'suggestion',
    async: false
  }),

  // Model validation rules.
  validations: {
    type: {
      presence: true
    },
    author: {
      presence: true
    },
    editor1: {
      presence: true
    }
  }
});

// Edit form projection.
Model.defineProjection('SuggestionE', 'ember-flexberry-dummy-suggestion', {
  address: Proj.attr('Address'),
  text: Proj.attr('Text'),
  date: Proj.attr('Date'),
  votes: Proj.attr('Votes'),
  moderated: Proj.attr('Moderated'),
  type: Proj.belongsTo('ember-flexberry-dummy-suggestion-type', 'Type', {
    name: Proj.attr('Name', {
      hidden: true
    })
  }, {
    displayMemberPath: 'name'
  }),
  author: Proj.belongsTo('ember-flexberry-dummy-application-user', 'Author', {
    name: Proj.attr('Name', {
      hidden: true
    })
  }, {
    displayMemberPath: 'name'
  }),
  editor1: Proj.belongsTo('ember-flexberry-dummy-application-user', 'Editor', {
    name: Proj.attr('Name', {
      hidden: true
    })
  }, {
    displayMemberPath: 'name'
  }),
  files: Proj.hasMany('ember-flexberry-dummy-suggestion-file', 'Files', {
    order: Proj.attr('Order'),
    file: Proj.attr('File')
  }),
  userVotes: Proj.hasMany('ember-flexberry-dummy-vote', 'User votes', {
    voteType: Proj.attr('Vote type'),
    applicationUser: Proj.belongsTo('ember-flexberry-dummy-application-user', 'Application user', {
      name: Proj.attr('Name', {
        hidden: true
      })
    }, {
      displayMemberPath: 'name'
    })
  }),
  comments: Proj.hasMany('ember-flexberry-dummy-comment', 'Comments', {
    text: Proj.attr('Text'),
    votes: Proj.attr('Votes'),
    moderated: Proj.attr('Moderated'),
    author: Proj.belongsTo('ember-flexberry-dummy-application-user', 'Author', {
      name: Proj.attr('Name', {
        hidden: true
      })
    }, {
      displayMemberPath: 'name'
    })
  })
});

// List form projection.
Model.defineProjection('SuggestionL', 'ember-flexberry-dummy-suggestion', {
  address: Proj.attr('Address'),
  text: Proj.attr('Text'),
  date: Proj.attr('Date'),
  votes: Proj.attr('Votes'),
  moderated: Proj.attr('Moderated'),
  type: Proj.belongsTo('ember-flexberry-dummy-suggestion-type', 'Type', {
    name: Proj.attr('Name', {
      hidden: true
    })
  }, {
    displayMemberPath: 'name'
  }),
  author: Proj.belongsTo('ember-flexberry-dummy-application-user', 'Author', {
    name: Proj.attr('Name', {
      hidden: true
    })
  }, {
    displayMemberPath: 'name'
  }),
  editor1: Proj.belongsTo('ember-flexberry-dummy-application-user', 'Editor', {
    name: Proj.attr('Name', {
      hidden: true
    })
  }, {
    displayMemberPath: 'name'
  })
});

// Projection for lookup example on settings example.
Model.defineProjection('SettingLookupExampleView', 'ember-flexberry-dummy-suggestion', {
  type: Proj.belongsTo('ember-flexberry-dummy-suggestion-type', 'Type', {
    name: Proj.attr('Name', {
      hidden: true
    })
  }, {
    displayMemberPath: 'name'
  })
});

// Projection for lookup example on window customization.
Model.defineProjection('CustomizeLookupWindowExampleView', 'ember-flexberry-dummy-suggestion', {
  type: Proj.belongsTo('ember-flexberry-dummy-suggestion-type', 'Type', {
    name: Proj.attr('Name', {
      hidden: true
    })
  }, {
    displayMemberPath: 'name'
  })
});

// Projection for lookup with limit function example.
Model.defineProjection('LookupWithLimitFunctionExampleView', 'ember-flexberry-dummy-suggestion', {
  type: Proj.belongsTo('ember-flexberry-dummy-suggestion-type', 'Type', {
    name: Proj.attr('Name', {
      hidden: true
    })
  }, {
    displayMemberPath: 'name'
  })
});

// Projection for lookup in dropdown mode example.
Model.defineProjection('DropDownLookupExampleView', 'ember-flexberry-dummy-suggestion', {
  type: Proj.belongsTo('ember-flexberry-dummy-suggestion-type', 'Type', {
    name: Proj.attr('Name', {
      hidden: true
    })
  }, {
    displayMemberPath: 'name'
  })
});

// Projection for FlexberryObjectlistviewComponent with limit function example.
Model.defineProjection('FolvWithLimitFunctionExampleView', 'ember-flexberry-dummy-suggestion', {
  address: Proj.attr('Address'),
  text: Proj.attr('Text'),
  votes: Proj.attr('Votes'),
  moderated: Proj.attr('Moderated'),
  type: Proj.belongsTo('ember-flexberry-dummy-suggestion-type', 'Type', {
    name: Proj.attr('Name', {
      hidden: true
    })
  }, {
    displayMemberPath: 'name'
  })
});

export default Model;
