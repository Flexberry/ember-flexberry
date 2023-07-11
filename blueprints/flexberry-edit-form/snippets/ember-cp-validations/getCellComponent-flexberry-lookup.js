        case '<%= detailModelName %>+<%= master %>':
          cellComponent.componentProperties = {
            choose: 'showLookupDialog',
            remove: 'removeLookupValue',
            displayAttributeName: '<%= displayAttributeName %>',
            required: <%= required %>,
            relationName: '<%= master %>',
            projection: '<%= projection %>',
            autocomplete: true,
            updateLookupValue: updateLookupValue,
          };
          break;
