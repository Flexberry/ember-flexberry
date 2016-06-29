          case '<%= master %>':
            return {
              componentName: 'flexberry-lookup',
              componentProperties: {
                choose: 'showLookupDialog',
                chooseText: '...',
                remove: 'removeLookupValue',
                displayAttributeName: '<%= displayAttributeName %>',
                required: <%= required %>,
                relationName: '<%= master %>',
                projection: '<%= projection %>',
                autocomplete: true
              }
            };
