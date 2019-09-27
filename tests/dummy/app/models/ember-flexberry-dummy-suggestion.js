import { on } from '@ember/object/evented';
import { observer } from '@ember/object';
import { once } from '@ember/runloop';
import DS from 'ember-data';
import EmberFlexberryDataModel from 'ember-flexberry-data/models/model';
import { attr, belongsTo, hasMany } from 'ember-flexberry-data/utils/attributes';
import { validator, buildValidations } from 'ember-cp-validations';

const Validations = buildValidations({
  type: validator('presence', {
    presence: true,
    message: 'Type is required',
  }),
  author: validator('presence', {
    presence: true,
    message: 'Author is required',
  }),
  editor1: validator('presence', {
    presence: true,
    message: 'Editor is required',
  }),
  userVotes: validator('has-many'),
});

let Model = EmberFlexberryDataModel.extend(Validations, {
  address: DS.attr('string'),
  text: DS.attr('string'),
  date: DS.attr('date'),
  votes: DS.attr('number'),
  moderated: DS.attr('boolean'),
  commentsCount: DS.attr('number'),

  // This property is for flexberry-lookup component. No inverse relationship here.
  type: DS.belongsTo('ember-flexberry-dummy-suggestion-type', {
    inverse: null,
    async: false
  }),

  // This property is for flexberry-lookup component. No inverse relationship here.
  author: DS.belongsTo('ember-flexberry-dummy-application-user', {
    inverse: null,
    async: false
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

  commentsChanged: on('init', observer('comments', function() {
    once(this, 'commentsCountCompute');
  })),

  commentsCountCompute: function() {
    if (!this.get('isDeleted')) {
      this.set('commentsCount', this.get('comments.length'));
    }
  },

  prototypeProjection: 'SuggestionE'
});

// Edit form projection.
Model.defineProjection('SuggestionE', 'ember-flexberry-dummy-suggestion', {
  address: attr('Address'),
  text: attr('Text'),
  date: attr('Date'),
  votes: attr('Votes'),
  moderated: attr('Moderated'),
  type: belongsTo('ember-flexberry-dummy-suggestion-type', 'Type', {
    name: attr('Name', {
      hidden: true
    })
  }, {
    displayMemberPath: 'name'
  }),
  author: belongsTo('ember-flexberry-dummy-application-user', 'Author', {
    name: attr('Name', {
      hidden: true
    })
  }, {
    displayMemberPath: 'name'
  }),
  editor1: belongsTo('ember-flexberry-dummy-application-user', 'Editor', {
    name: attr('Name', {
      hidden: true
    })
  }, {
    displayMemberPath: 'name'
  }),
  files: hasMany('ember-flexberry-dummy-suggestion-file', 'Files', {
    order: attr('Order'),
    file: attr('File')
  }),
  userVotes: hasMany('ember-flexberry-dummy-vote', 'User votes', {
    voteType: attr('Vote type'),
    author: belongsTo('ember-flexberry-dummy-application-user', 'Application user', {
      name: attr('Name', {
        hidden: true
      }),
      eMail: attr('Email')
    }, {
      displayMemberPath: 'name'
    })
  }),
  comments: hasMany('ember-flexberry-dummy-comment', 'Comments', {
    text: attr('Text'),
    votes: attr('Votes'),
    moderated: attr('Moderated'),
    author: belongsTo('ember-flexberry-dummy-application-user', 'Author', {
      name: attr('Name', {
        hidden: true
      })
    }, {
      displayMemberPath: 'name'
    })
  })
});

// Edit form projection.
Model.defineProjection('SuggestionMainModelProjectionTest', 'ember-flexberry-dummy-suggestion', {
  userVotes: hasMany('ember-flexberry-dummy-vote', 'User votes', {
    voteType: attr('Vote type')
  })
});

// List form projection.
Model.defineProjection('SuggestionL', 'ember-flexberry-dummy-suggestion', {
  address: attr('Address', { index: 0 }),
  text: attr('Text', { index: 1 }),
  date: attr('Date', { index: 2 }),
  votes: attr('Votes', { index: 3 }),
  moderated: attr('Moderated', { index: 4 }),
  type: belongsTo('ember-flexberry-dummy-suggestion-type', 'Type', {
    name: attr('Name', { index: 6, hidden: true })
  }, { index: 5, displayMemberPath: 'name' }),
  author: belongsTo('ember-flexberry-dummy-application-user', 'Author', {
    name: attr('Name', { index: 8, hidden: true }),
    eMail: attr('Email', { index: 9 })
  }, { index: 7, displayMemberPath: 'name' }),
  editor1: belongsTo('ember-flexberry-dummy-application-user', 'Editor', {
    name: attr('Name', { index: 11, hidden: true })
  }, { index: 10, displayMemberPath: 'name' }),
  commentsCount: attr('Comments Count', { index: 15 }),
  comments: hasMany('ember-flexberry-dummy-comment', 'Comments', {
    text: attr('Text', { index: 0 }),
    votes: attr('Votes', { index: 1 }),
    moderated: attr('Moderated', { index: 2 }),
    author: belongsTo('ember-flexberry-dummy-application-user', 'Author', {
      name: attr('Name', { index: 4, hidden: true })
    }, { index: 3, displayMemberPath: 'name' })
  })
});

// Projection for lookup example on settings example.
Model.defineProjection('SettingLookupExampleView', 'ember-flexberry-dummy-suggestion', {
  type: belongsTo('ember-flexberry-dummy-suggestion-type', 'Type', {
    name: attr('Name', {
      hidden: true
    })
  }, {
    displayMemberPath: 'name'
  })
});

// Projection for lookup example on preview example.
Model.defineProjection('PreviewExampleView', 'ember-flexberry-dummy-suggestion', {
  author: belongsTo('ember-flexberry-dummy-application-user', 'Author', {
    name: attr('Name', {
      hidden: true
    })
  }, {
    displayMemberPath: 'name'
  }),
  editor1: belongsTo('ember-flexberry-dummy-application-user', 'Editor', {
    name: attr('Name', {
      hidden: true
    })
  }, {
    displayMemberPath: 'name'
  }),
  userVotes: hasMany('ember-flexberry-dummy-vote', 'User votes', {
    author: belongsTo('ember-flexberry-dummy-application-user', 'Application user', {
      name: attr('Name', {
        hidden: true
      })
    }, {
      displayMemberPath: 'name'
    })
  }),
});

// Projection for lookup example on window customization.
Model.defineProjection('CustomizeLookupWindowExampleView', 'ember-flexberry-dummy-suggestion', {
  type: belongsTo('ember-flexberry-dummy-suggestion-type', 'Type', {
    name: attr('Name', {
      hidden: true
    })
  }, {
    displayMemberPath: 'name'
  })
});

// Projection for lookup with limit function example.
Model.defineProjection('LookupWithLimitFunctionExampleView', 'ember-flexberry-dummy-suggestion', {
  type: belongsTo('ember-flexberry-dummy-suggestion-type', 'Type', {
    name: attr('Name', {
      hidden: true
    })
  }, {
    displayMemberPath: 'name'
  })
});

// Projection for lookup in dropdown mode example.
Model.defineProjection('DropDownLookupExampleView', 'ember-flexberry-dummy-suggestion', {
  type: belongsTo('ember-flexberry-dummy-suggestion-type', 'Type', {
    name: attr('Name', {
      hidden: true
    })
  }, {
    displayMemberPath: 'name'
  })
});

// Projection for FlexberryObjectlistviewComponent with limit function example.
Model.defineProjection('FolvWithLimitFunctionExampleView', 'ember-flexberry-dummy-suggestion', {
  address: attr('Address'),
  text: attr('Text'),
  votes: attr('Votes'),
  moderated: attr('Moderated'),
  type: belongsTo('ember-flexberry-dummy-suggestion-type', 'Type', {
    name: attr('Name', {
      hidden: true
    })
  }, {
    displayMemberPath: 'name'
  })
});

// Projection for lookup in block form.
Model.defineProjection('LookupInBlockFormView', 'ember-flexberry-dummy-suggestion', {
  editor1: belongsTo('ember-flexberry-dummy-application-user', 'Editor', {
    name: attr('name', { hidden: true }),
    eMail: attr('eMail', { hidden: true }),
    gender: attr('gender', { hidden: true })
  }, {
    displayMemberPath: 'name'
  })
});

// Example custom filter.
Model.defineProjection('FlexberryObjectlistviewCustomFilter', 'ember-flexberry-dummy-suggestion', {
  address: attr('Address'),
  date: attr('Date'),
  votes: attr('Votes'),
  type: belongsTo('ember-flexberry-dummy-suggestion-type', 'Type', {
    name: attr('Name', {
      hidden: true,
    }),
    moderated: attr('Moderated'),
    parent: belongsTo('ember-flexberry-dummy-suggestion-type', 'Parent moderated', {
      moderated: attr('Moderated', {
        hidden: true,
      }),
      name: attr('Parent type'),
    }, {
      displayMemberPath: 'moderated',
    }),
  }, {
    displayMemberPath: 'name',
  }),
  author: belongsTo('ember-flexberry-dummy-application-user', 'Author', {
    name: attr('Name', {
      hidden: true,
    }),
    eMail: attr('Author email'),
  }, {
    displayMemberPath: 'name',
  }),
  editor1: belongsTo('ember-flexberry-dummy-application-user', 'Editor', {
    name: attr('Name', {
      hidden: true,
    }),
  }, {
    displayMemberPath: 'name',
  }),
});

// Projection for lookup default ordering example.
Model.defineProjection('DefaultOrderingExampleView', 'ember-flexberry-dummy-suggestion', {
  type: belongsTo('ember-flexberry-dummy-suggestion-type', 'Type', {
    name: attr('Name', {
      hidden: true
    })
  }, {
    displayMemberPath: 'name'
  })
});

// Example to filter test.
Model.defineProjection('FlexberryObjectlistviewFilterTest', 'ember-flexberry-dummy-suggestion', {
  address: attr('Address'),
  date: attr('Date'),
  votes: attr('Votes'),
  moderated: attr('Moderated'),
  type: belongsTo('ember-flexberry-dummy-suggestion-type', 'Type', {
    name: attr('Name', {
      hidden: true
    })
  }, {
    displayMemberPath: 'name'
  }),
  author: belongsTo('ember-flexberry-dummy-application-user', 'Author', {
    name: attr('Name', {
      hidden: true
    })
  }, {
    displayMemberPath: 'name'
  })
});

// Projection for lookup with computed field test.
Model.defineProjection('SuggestionEWithComputedField', 'ember-flexberry-dummy-suggestion', {
  address: attr(''),
  text: attr(''),
  date: attr(''),
  votes: attr(''),
  moderated: attr(''),
  author: belongsTo('ember-flexberry-dummy-application-user', '', {
    name: attr('')
  }),
  type: belongsTo('ember-flexberry-dummy-suggestion-type', '', {
    name: attr(''),
    moderated: attr(''),
    computedField: attr('')
  }),
  editor1: belongsTo('ember-flexberry-dummy-application-user', '', {
    name: attr('')
  }),
  createTime: attr(''),
  creator: attr(''),
  editTime: attr(''),
  editor: attr('')
});

export default Model;
