,
    /**
     * Current function to limit accessible values of model <%=name%>.
     *
     * @property lookupLimitFunction
     * @type String
     * @default undefined
     */
    lookupLimitFunction_<%=name%>: Ember.computed('model.<%=name%>', function () {
        let currentLookupValue = this.get('model.<%=name%>');
        if (currentLookupValue) {
            let currentLookupText = this.get('model.<%=name%>.<%=lookupValueField%>');
            return '<%=lookupValue%> ge \'' + currentLookupText + '\'';
        }
        return undefined;
    })

