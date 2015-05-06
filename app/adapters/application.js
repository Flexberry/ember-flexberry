import Ember from 'ember';
import DS from 'ember-data';

// Adapter for OData service.
// TODO: ODataAdapter.
export default DS.RESTAdapter.extend({
    host: 'http://northwindodata.azurewebsites.net/odata',
    //host: 'http://localhost:4356/odata',
    pathForType: function(type) {
        var camelized = Ember.String.camelize(type),
            capitalized = Ember.String.capitalize(camelized);
        return Ember.String.pluralize(capitalized);
    },

    // Own property - to solve the problem: id always is string - see ember-data.js, comments for function coerceId(id).
    // TODO: вынести в базовый "абстрактный" класс и поставить атрибут Ember.required.
    idType: 'number',

    // Own method.
    // TODO: вынести в базовый "абстрактный" класс и поставить атрибут Ember.required (для метода работает?, либо просто throw not implemented).
    getPaginationQuery: function(page, perPage, sortingInfo, serializer) {
        var query = { '$top': perPage, '$skip': (page - 1) * perPage, '$count': true };

        if (sortingInfo && sortingInfo.length > 0) {
            var serializedSortingInfo = sortingInfo.map(function(element) {
                return serializer.keyForAttribute(element.propName) + ' ' + element.direction;
            }).join(', ');
            query['$orderby'] = serializedSortingInfo;
        }

        return query;
    },

    find: function(store, type, id, snapshot) {
        var view = snapshot.get('_view');
        if (!view) {
            return this._super.apply(this, arguments);
        } else {
            var url = this.buildURL(type.typeKey, id);
            var serializer = store.serializerFor(type);
            var query = this.getDataObjectViewQuery(view, serializer);
            return this.ajax(url, 'GET', { data: query }).then(function(data) {
                data._view = view;
                return data;
            });
        }
    },

    findQuery: function(store, type, query) {
        var view = query._view;
        if (!view) {
            return this._super.apply(this, arguments);
        } else {
            delete query._view;
            var serializer = store.serializerFor(type);
            var viewQuery = this.getDataObjectViewQuery(view, serializer);
            query = Ember.merge(viewQuery, query);
            return this._super(store, type, query).then(function(data) {
                for(var i = 0; i < data.value.length; i++) {
                    data.value[i]._view = view;
                }

                data._manyview = view;
                return data;
            });
        }
    },

    // TODO: Логику view2query можно вынести в отдельный класс, наверное, а то целых 4 вспомогательных функции.
    // Supports OData v4 only.
    getDataObjectViewQuery: function(view, serializer) {
        var tree = this._getODataQueryTree(view, serializer),
            query = this._getODataQuery(tree);
        return query;
    },

    _getODataQueryTree: function(view, serializer) {
        var self = this,
            tree = {
                select: [serializer.primaryKey],
                expand: {}
            },
            expanders = [view.masters, view.details];

        if (view.properties) {
            view.properties.forEach(function(prop) {
                tree.select.push(serializer.keyForAttribute(prop));
            });
        }

        expanders.forEach(function(expander) {
            if (!expander) {
                return;
            }

            for (var propertyName in expander) {
                if (expander.hasOwnProperty(propertyName)) {
                    var normalizedPropName = serializer.keyForAttribute(propertyName);
                    tree.select.push(normalizedPropName);

                    var expanderView = expander[propertyName];
                    tree.expand[normalizedPropName] = self._getODataQueryTree(expanderView, serializer);
                }
            }
        });

        return tree;
    },

    _getODataQuery: function(queryTree) {
        var select = this._getODataSelectQuery(queryTree),
            expand = this._getODataExpandQuery(queryTree);

        var query = {};
        if (select) {
            query['$select'] = select;
        }

        if (expand) {
            //query['$expand'] = expand;
        }

        return query;
    },

    _getODataExpandQuery: function(queryTree) {
        var expandProperties = Object.keys(queryTree.expand);
        if (!expandProperties.length) {
            return null;
        }

        var self = this,
            query = [];
        expandProperties.forEach(function(propertyName) {
            var subTree = queryTree.expand[propertyName];
            var expr = propertyName;
            var select = self._getODataSelectQuery(subTree);
            var expand = self._getODataExpandQuery(subTree);
            if (select || expand) {
                expr += '(';
                if (select) {
                    expr += '$select=' + select;
                }

                if (expand) {
                    expr += ';' + '$expand=' + expand;
                }

                expr += ')';
            }

            query.push(expr);
        });

        return query.join(',');
    },

    _getODataSelectQuery: function(queryTree) {
        if (queryTree.select.length) {
            return queryTree.select.join(',');
        } else {
            return null;
        }
    },

    buildURL: function(type, id, record) {
        var url = [],
            host = Ember.get(this, 'host'),
            prefix = this.urlPrefix();

        if (type) {
            url.push(this.pathForType(type));
        }

        if (prefix) {
            url.unshift(prefix);
        }

        url = url.join('/');
        if (!host && url) {
            url = '/' + url;
        }

        //We might get passed in an array of ids from findMany
        //in which case we don't want to modify the url, as the
        //ids will be passed in through a query param
        if (id && !Ember.isArray(id)) {
            var encId = encodeURIComponent(id),
                idType = Ember.get(this, 'idType');
            if (idType !== 'number') {
                encId = "'" + encId + "'";
            }

            url += '(' + encId + ')';
        }

        // /Customers('ALFKI')
        // /Employees(4)
        return url;
    },

    updateRecord: function(store, type, snapshot) {
        var data = {},
            serializer = store.serializerFor(type.typeKey),
            objectView = snapshot.record.get('_view');

        serializer.serializeIntoHash(data, type, snapshot);

        var id = Ember.get(snapshot, 'id');
        var method = objectView ? 'PATCH' : 'PUT';

        return this.ajax(this.buildURL(type.typeKey, id, snapshot), method, { data: data });
    }
});
