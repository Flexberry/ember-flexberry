        case '<%= detailModelName %>+<%= master %>':
          cellComponent.componentProperties = {
            choose: 'showLookupDialog',
            chooseText: '...',
            remove: 'removeLookupValue',
            displayAttributeName: '<%= displayAttributeName %>',
            required: <%= required %>,
            relationName: '<%= master %>',
            projection: '<%= projection %>',
            autocomplete: true,
          };
          break;
