import Ember from 'ember';
import DS from 'ember-data';
import { Projection } from 'ember-flexberry-data';

var Model = Projection.Model.extend({
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
      presence: {
        message: 'Type is required'
      }
    },
    author: {
      presence: {
        message: 'Author is required'
      }
    },
    editor1: {
      presence: {
        message: 'Editor is required'
      }
    }
  },

  commentsChanged: Ember.on('init', Ember.observer('comments', function() {
    Ember.run.once(this, 'commentsCountCompute');
  })),

  commentsCountCompute: function() {
    let result = 0;
    this.get('comments').forEach(function() {
      result++;
    });
    this.set('commentsCount', result);
  }
});

// Edit form projection.
Model.defineProjection('SuggestionE', 'ember-flexberry-dummy-suggestion', {
  address: Projection.attr('Address'),
  text: Projection.attr('Text'),
  date: Projection.attr('Date'),
  votes: Projection.attr('Votes'),
  moderated: Projection.attr('Moderated'),
  type: Projection.belongsTo('ember-flexberry-dummy-suggestion-type', 'Type', {
    name: Projection.attr('Name', {
      hidden: true
    })
  }, {
    displayMemberPath: 'name'
  }),
  author: Projection.belongsTo('ember-flexberry-dummy-application-user', 'Author', {
    name: Projection.attr('Name', {
      hidden: true
    })
  }, {
    displayMemberPath: 'name'
  }),
  editor1: Projection.belongsTo('ember-flexberry-dummy-application-user', 'Editor', {
    name: Projection.attr('Name', {
      hidden: true
    })
  }, {
    displayMemberPath: 'name'
  }),
  files: Projection.hasMany('ember-flexberry-dummy-suggestion-file', 'Files', {
    order: Projection.attr('Order'),
    file: Projection.attr('File')
  }),
  userVotes: Projection.hasMany('ember-flexberry-dummy-vote', 'User votes', {
    voteType: Projection.attr('Vote type'),
    author: Projection.belongsTo('ember-flexberry-dummy-application-user', 'Application user', {
      name: Projection.attr('Name', {
        hidden: true
      }),
      eMail: Projection.attr('Email')
    }, {
      displayMemberPath: 'name'
    })
  }),
  comments: Projection.hasMany('ember-flexberry-dummy-comment', 'Comments', {
    text: Projection.attr('Text'),
    votes: Projection.attr('Votes'),
    moderated: Projection.attr('Moderated'),
    author: Projection.belongsTo('ember-flexberry-dummy-application-user', 'Author', {
      name: Projection.attr('Name', {
        hidden: true
      })
    }, {
      displayMemberPath: 'name'
    })
  })
});

// List form projection.
Model.defineProjection('SuggestionL', 'ember-flexberry-dummy-suggestion', {
  address: Projection.attr('Address'),
  text: Projection.attr('Text'),
  date: Projection.attr('Date'),
  votes: Projection.attr('Votes'),
  moderated: Projection.attr('Moderated'),
  type: Projection.belongsTo('ember-flexberry-dummy-suggestion-type', 'Type', {
    name: Projection.attr('Name', {
      hidden: true
    })
  }, {
    displayMemberPath: 'name'
  }),
  author: Projection.belongsTo('ember-flexberry-dummy-application-user', 'Author', {
    name: Projection.attr('Name', {
      hidden: true
    }),
    eMail: Projection.attr('Email')
  }, {
    displayMemberPath: 'name'
  }),
  editor1: Projection.belongsTo('ember-flexberry-dummy-application-user', 'Editor', {
    name: Projection.attr('Name', {
      hidden: true
    })
  }, {
    displayMemberPath: 'name'
  }),
  commentsCount: Projection.attr('Comments Count'),
  comments: Projection.hasMany('ember-flexberry-dummy-comment', 'Comments', {
    text: Projection.attr('Text'),
    votes: Projection.attr('Votes'),
    moderated: Projection.attr('Moderated'),
    author: Projection.belongsTo('ember-flexberry-dummy-application-user', 'Author', {
      name: Projection.attr('Name', { hidden: true })
    }, { displayMemberPath: 'name' })
  })
});

// Projection for lookup example on settings example.
Model.defineProjection('SettingLookupExampleView', 'ember-flexberry-dummy-suggestion', {
  type: Projection.belongsTo('ember-flexberry-dummy-suggestion-type', 'Type', {
    name: Projection.attr('Name', {
      hidden: true
    })
  }, {
    displayMemberPath: 'name'
  })
});

// Projection for lookup example on window customization.
Model.defineProjection('CustomizeLookupWindowExampleView', 'ember-flexberry-dummy-suggestion', {
  type: Projection.belongsTo('ember-flexberry-dummy-suggestion-type', 'Type', {
    name: Projection.attr('Name', {
      hidden: true
    })
  }, {
    displayMemberPath: 'name'
  })
});

// Projection for lookup with limit function example.
Model.defineProjection('LookupWithLimitFunctionExampleView', 'ember-flexberry-dummy-suggestion', {
  type: Projection.belongsTo('ember-flexberry-dummy-suggestion-type', 'Type', {
    name: Projection.attr('Name', {
      hidden: true
    })
  }, {
    displayMemberPath: 'name'
  })
});

// Projection for lookup in dropdown mode example.
Model.defineProjection('DropDownLookupExampleView', 'ember-flexberry-dummy-suggestion', {
  type: Projection.belongsTo('ember-flexberry-dummy-suggestion-type', 'Type', {
    name: Projection.attr('Name', {
      hidden: true
    })
  }, {
    displayMemberPath: 'name'
  })
});

// Projection for FlexberryObjectlistviewComponent with limit function example.
Model.defineProjection('FolvWithLimitFunctionExampleView', 'ember-flexberry-dummy-suggestion', {
  address: Projection.attr('Address'),
  text: Projection.attr('Text'),
  votes: Projection.attr('Votes'),
  moderated: Projection.attr('Moderated'),
  type: Projection.belongsTo('ember-flexberry-dummy-suggestion-type', 'Type', {
    name: Projection.attr('Name', {
      hidden: true
    })
  }, {
    displayMemberPath: 'name'
  })
});

// Projection for lookup in block form.
Model.defineProjection('LookupInBlockFormView', 'ember-flexberry-dummy-suggestion', {
  editor1: Projection.belongsTo('ember-flexberry-dummy-application-user', 'Editor', {
    name: Projection.attr('name', { hidden: true }),
    eMail: Projection.attr('eMail', { hidden: true }),
    gender: Projection.attr('gender', { hidden: true })
  }, {
    displayMemberPath: 'name'
  })
});

// Example custom filter.
Model.defineProjection('FlexberryObjectlistviewCustomFilter', 'ember-flexberry-dummy-suggestion', {
  address: Projection.attr('Address'),
  date: Projection.attr('Date'),
  votes: Projection.attr('Votes'),
  type: Projection.belongsTo('ember-flexberry-dummy-suggestion-type', 'Type', {
    name: Projection.attr('Name', {
      hidden: true,
    }),
    moderated: Projection.attr('Moderated'),
    parent: Projection.belongsTo('ember-flexberry-dummy-suggestion-type', 'Parent moderated', {
      moderated: Projection.attr('Moderated', {
        hidden: true,
      }),
      name: Projection.attr('Parent type'),
    }, {
      displayMemberPath: 'moderated',
    }),
  }, {
    displayMemberPath: 'name',
  }),
  author: Projection.belongsTo('ember-flexberry-dummy-application-user', 'Author', {
    name: Projection.attr('Name', {
      hidden: true,
    }),
    eMail: Projection.attr('Author email'),
  }, {
    displayMemberPath: 'name',
  }),
  editor1: Projection.belongsTo('ember-flexberry-dummy-application-user', 'Editor', {
    name: Projection.attr('Name', {
      hidden: true,
    }),
  }, {
    displayMemberPath: 'name',
  }),
});

// Projection for lookup default ordering example.
Model.defineProjection('DefaultOrderingExampleView', 'ember-flexberry-dummy-suggestion', {
  type: Projection.belongsTo('ember-flexberry-dummy-suggestion-type', 'Type', {
    name: Projection.attr('Name', {
      hidden: true
    })
  }, {
    displayMemberPath: 'name'
  })
});

export default Model;
